import { Component, OnInit, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

interface TopArtists {
  items: Item[]
}

interface Item {
  name: String
  images: Image[]
  genres: String[]
}

interface Image {
  url: String
  height: String
  width: String
}

const GET_TOP_ARTISTS = gql`
  query getTopArtists($token: String!){
    getTopArtists(token: $token) {
      items {
        name
        images {
          url
          height
          width
        }
        genres
      }
    }
  }
`;

@Component({
  selector: 'app-top-items',
  templateUrl: './top-items.component.html',
  styleUrls: ['./top-items.component.scss']
})
export class TopItemsComponent implements OnInit {
  @Input() accessToken: String = '';

  topArtists: TopArtists = {items: []}
  loading = true;
  error: any;
  querySubscription: Subscription | null = null;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    console.log(this.accessToken)

    this.querySubscription = this.apollo
      .watchQuery({
        query: GET_TOP_ARTISTS,
        variables: {
          token: this.accessToken
        }
      })
      .valueChanges.subscribe((result: any) => {
        console.log(result)
        this.topArtists = result.data.getTopArtists;
        this.loading = result.loading;
        this.error = result.error;
      })
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
