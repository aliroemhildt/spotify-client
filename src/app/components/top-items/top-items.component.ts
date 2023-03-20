import { Component, OnInit, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

interface Artist {
  name: String
  images: Image
  genres: String[]
}

interface Track {
  name: String
  artists: Artist[]
}

interface Image {
  url: String
  height: String
  width: String
}


const GET_TOP_ARTISTS = gql`
  query getTopArtists($token: String!, $itemType: String!, $timeRange: String!){
    getTopItems(token: $token, itemType: $itemType, timeRange: $timeRange) {
      items {
        ... on Artist {
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
  }
`;

const GET_TOP_TRACKS = gql`
  query getTopTracks($token: String!, $itemType: String!, $timeRange: String!){
    getTopItems(token: $token, itemType: $itemType, timeRange: $timeRange) {
      items {
        ... on Track {
        name
        artists {
          name
        }
      }
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
  @Input() itemType: String = '';

  timeRange: String = "short_term"
  topItems: (Artist | Track)[] | [] = []
  loading = true;
  error: any;
  querySubscription: Subscription | null = null;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    if (this.itemType == 'artists') {
      this.querySubscription = this.apollo
      .watchQuery({
        query: GET_TOP_ARTISTS,
        variables: {
          token: this.accessToken,
          itemType: this.itemType,
          timeRange: this.timeRange
        }
      })
      .valueChanges.subscribe((result: any) => {
        this.topItems = result.data.getTopItems.items;
        this.loading = result.loading;
        this.error = result.error;
      })
    }
    if (this.itemType == 'tracks') {
      this.querySubscription = this.apollo
      .watchQuery({
        query: GET_TOP_TRACKS,
        variables: {
          token: this.accessToken,
          itemType: this.itemType,
          timeRange: this.timeRange
        }
      })
      .valueChanges.subscribe((result: any) => {
        this.topItems = result.data.getTopItems.items;
        this.loading = result.loading;
        this.error = result.error;
      })
    }
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
