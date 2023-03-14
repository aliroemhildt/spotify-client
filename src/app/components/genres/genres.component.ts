import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

const GET_GENRES = gql`
  query getGenres($token: String!){
    getGenres(token: $token) {
      genres
    }
  }
`;

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})
export class GenresComponent implements OnInit {
  @Input() accessToken: String = '';
  
  genres = [];
  loading = true;
  error: any;
  querySubscription: Subscription | null = null; //figure out how to remove null from this, do I need to use a subscription?

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery({
      query: GET_GENRES,
      variables: {
        token: this.accessToken
      }
    })
    .valueChanges.subscribe((result: any) => {
      this.genres = result.data.getGenres.genres; //structure gql query differently to return data.genres
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
