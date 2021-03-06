/**
 * Created by abbeymart on 2016-12-31 | Updated: Mar-28-2017
 * JWT (JSON Web Token) plugin functions for the client/UI & API
 */
export const auth = {
    setToken( token, expire ) {
        localStorage.setItem( 'authToken', token );
        localStorage.setItem( 'authTokenExpire', expire );
    },
    removeToken() {
        localStorage.removeItem( 'authToken' );
        localStorage.removeItem( 'authTokenExpire' );
    },
    getToken() {
        const token  = localStorage.getItem( 'authToken' ),
              expire = localStorage.getItem( 'authTokenExpire' );
        if( !token || !expire ) {
            return null;
        }
        if( Date.now() > parseInt( expire ) ) {
            this.removeToken();
            return null;
        }
        return token;
    },
    loggedIn() {
        if( this.getToken() ) {
            return true;
        } else {
            return false;
        }
    },
};
