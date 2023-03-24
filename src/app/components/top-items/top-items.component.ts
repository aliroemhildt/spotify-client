import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
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
export class TopItemsComponent implements OnInit, OnDestroy {
  @Input() accessToken: String = '';
  @Input() itemType: String = '';

  timeRange: String = "short_term"
  topItems: (Artist | Track)[] | [] = []
  loading = true;
  error: any;
  topItemsQuery!: QueryRef<any>;
  
  private querySubscription!: Subscription;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    let myQuery: any = null;
    
    if (this.itemType == 'artists') {
      myQuery = GET_TOP_ARTISTS;
    }
    if (this.itemType == 'tracks') {
      myQuery = GET_TOP_TRACKS;
    }

    this.topItemsQuery = this.apollo.watchQuery<any>({
      query: myQuery,
      variables: {
        token: this.accessToken,
        itemType: this.itemType,
        timeRange: this.timeRange
      }
    });

    this.querySubscription = this.topItemsQuery
      .valueChanges.subscribe((result: any) => {
        this.topItems = result.data.getTopItems.items;
        this.loading = result.loading;
        this.error = result.error;
      });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  changeTime(newTimeRange: String) {
    this.timeRange = newTimeRange;
    this.topItemsQuery.refetch({ timeRange: this.timeRange });
  }
}
