import { Component } from '@angular/core';
import { Buffer } from 'buffer';
import { environment } from 'src/environments/environment';

interface AccessData {
  access_token?: String
  expires_in?: String
  refresh_token?: String
  scope?: String
  token_type?: String
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  loggedIn = false;
  authCode ='';
  accessData: AccessData = {};
  client_id: String = environment.CLIENT_ID;
  client_secret: String = environment.CLIENT_SECRET;
  response_type = 'code';
  show_dialog = 'true';
  redirect_uri = 'http://localhost:4200/';
  scopes = ['ugc-image-upload', 'user-read-playback-state', 'user-read-email', 'user-read-private', 'user-top-read'];
  scopes_url_param = this.scopes.join('%20');
  // state

  ngOnInit(): void {
    if (window.location.search && !this.authCode) {
      this.authCode = this.getAuthCode();
      this.getAccessToken(this.authCode);
      this.loggedIn = true;
    }
    // handle page reload when logged in, shouldn't run getAccess token on page reload
  }

  requestAuthCode() {
    window.location.href = `https://accounts.spotify.com/authorize?response_type=${this.response_type}&client_id=${this.client_id}&scope=${this.scopes_url_param}&redirect_uri=${this.redirect_uri}&show_dialog=${this.show_dialog}`;
  }

  getAuthCode() {
    return window.location.search.substring(6);
  }

  getAccessToken(authCode: String) {
    const reqHeaders = new Headers({
      'Authorization': 'Basic ' + Buffer.from(this.client_id + ':' + this.client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const reqBody = `grant_type=authorization_code&code=${authCode}&redirect_uri=${this.redirect_uri}`;
   
    fetch('https://accounts.spotify.com/api/token',{
      method: 'POST',
      headers: reqHeaders,
      body: reqBody
    })
    .then(response => response.json())
    .then(response => this.accessData = response)
  }
  
}
