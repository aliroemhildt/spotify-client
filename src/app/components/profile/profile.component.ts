import { Component, OnInit, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

interface CurrentUser {
  display_name: String
  id: String
  images: Image[]
}

interface Image {
  url: String
  height: String
  width: String
}

const GET_CURRENT_USER = gql`
  query getCurrentUser($token: String!){
    getCurrentUser(token: $token) {
      display_name
      id
      images {
        url
        height
        width
      }
    }
  }
`;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() accessToken: String = '';

  currentUser: CurrentUser | null = null;
  loading = true;
  error: any;
  querySubscription: Subscription | null = null; //figure out how to remove null from this, do I need to use a subscription?

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.querySubscription = this.apollo
      .watchQuery({
        query: GET_CURRENT_USER,
        variables: {
          token: this.accessToken
        }
      })
      .valueChanges.subscribe((result: any) => {
        this.currentUser = result.data.getCurrentUser;
        this.loading = result.loading;
        this.error = result.error;
      })
  }
}
