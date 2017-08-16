import environment from '~/environment';

const configForDevelopment = {
  responseTokenProp: 'token',
  baseUrl: environment.base,
  logoutRedirect: '/',
  loginRoute: '/auth',
  signupRoute: '/auth/signup',
  profileUrl: '/me',
  tokenPrefix: '',
  providers: {
    facebook: {
      name: 'facebook',
      url: '/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/v2.10/dialog/oauth',
      redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
      scope: ['email'],
      scopeDelimiter: ',',
      nonce: function() {
        return Math.random();
      },
      requiredUrlParams: ['nonce', 'display', 'scope'],
      display: 'popup',
      type: '2.0',
      clientId: '116846465638888',
      popupOptions: { width: 580, height: 400 }
    }
  }
};

const configForProduction = {
  responseTokenProp: 'token',
  baseUrl: 'https://api.novelship.com/',
  logoutRedirect: '/',
  loginRoute: '/auth',
  signupRoute: '/auth/signup',
  profileUrl: '/me',
  tokenPrefix: ''
};

let authConfig;

if (window.location.hostname === 'localhost') {
  authConfig = configForDevelopment;
} else {
  authConfig = configForProduction;
}


export default authConfig;
