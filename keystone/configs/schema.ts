import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  file,
  calendarDay,
  decimal,
  checkbox,
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import type { Lists } from '.keystone/types';
import util from 'util'



type Session = {
  data: {
    id: string;
    name: string;
    role: string;
    email: string;
  }
}

export const lists: Lists = {
  
  User: list({
    access:{
      operation: allowAll,
      filter: {

        query: ({ session, context, listKey, operation }) => {
          
          // NOTE: graphql playgound doesn't have any session data, so 
          // if we don't return true at the very end here, we wont
          // be able to access any data through it

          // TODO: remove before publishing. playground access needs to happen
          // with a valid token.
          return true 

          // production
          // return {email: {equals: session?.data.email}}

        }
      }
    },
    

    fields: {
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),

      password: password(),
      
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
        ui: { 
          createView: {
            fieldMode: "hidden" 
          } 
        }
      }),

      organization: relationship({
        ref: "Organization",
        many: false,
        ui: {
          labelField: "id"
        }
      }),

      invitationToken: text(),
      passwordResetToken: text(),
      name: text(),
    },
    ui: {
      listView: {
        initialColumns: ["email", "organization", "name"]
      }
    }
  }),



};
