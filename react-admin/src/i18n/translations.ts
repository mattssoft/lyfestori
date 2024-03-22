import en from 'ra-language-english';
import fi from 'ra-language-finnish';
import sv from '@kolben/ra-language-swedish';

import { authUITranslations } from '../core/authentication/i18n';

export const translations = { 
    en: {
        ...en,
        ...authUITranslations.en,
        appBar: {
            userMenu: {
                editUserProfile: "Edit Profile"
            }
        },
    }, 




    fi: {
        ...fi,
        ...authUITranslations.fi,
        appBar: {
            userMenu: {
                editUserProfile: "Hallinoi käyttäjä"
            }
        }
    },



    sv: {
        ...sv,
        ...authUITranslations.sv,        
        appBar: {
            userMenu: {
                editUserProfile: "Redigera profil"
            }
        }
    }
};