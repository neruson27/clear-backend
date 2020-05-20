
import { ForbiddenError } from 'apollo-server-express';

function handleError (exception) {
  return Promise.reject(exception);
}

export function authorize (roles, resolver) {
  console.log(resolver)
  return function (obj, body, context, info) {
    console.log('obj: ', obj);
    console.log('body: ', body);
    // console.log('context: ', context);

    const user = context.credentials.user;
    const error = context.credentials.error
    try {
      if (!Array.isArray(roles)) throw "role-invalid-type";
      // if (roles.length == 0) throw "roles debe contener al menos un rol:'user', 'admin'";
      if (roles.length > 0) {
        // si se requiere token y este expiro, 
        if (error && error == 'token-expired') throw "not-authorized-token-expired"
        // si no esta logueado
        else if (!user) throw "not-authenticated";
        // si no esta autorizado
        else if (roles.indexOf(user.role) == -1) throw "not-authorized";
      }

      console.log('resolver success');
      return resolver(obj, body, context, info);
    }
    catch (error) {
      if (error === 'role-invalid-type'){
        console.log(`error authorize resolver ${info.fieldName}: roles debe ser un array: [] para acceso libre o  ['user', 'admin'] para acceso restringido`);
        return handleError(new Error('internal-error'))
      }
      else if (error === 'not-authenticated'){
        console.log(`error authorize resolver ${info.fieldName}: Debe estar logueado para acceder a este recurso`);
        return handleError(new ForbiddenError(error));
        
      }
      else if (error === 'not-authorized-token-expired'){
        console.log(`error authorize resolver ${info.fieldName}: Debe estar logueado para acceder a este recurso`);
        return handleError(new ForbiddenError(error));
        
      }
      else if (error === 'not-authorized'){
        console.log(`error authorize resolver ${info.fieldName}: No tiene permiso para este recurso`);
        return handleError(new ForbiddenError(error));
      }
      
    }
  }
}




// function handleError (message, code) {
//   return Promise.reject(message);
// }

// export function authorize (roles, resolver) {
//   return function (obj, body, context, info) {
//     console.log('obj: ', obj);
//     console.log('body: ', body);
//     // console.log('context: ', context);

//     const user = context.credentials.user;
//     try {
//       if (!Array.isArray(roles)) throw "role invalid type";
//       // if (roles.length == 0) throw "roles debe contener al menos un rol:'user', 'admin'";
//       if (roles.length > 0) {
//         if (!user) throw "not authenticated";
//         if (roles.indexOf(user.role) == -1) throw "not authorized";
//       }

//       return resolver(obj, body, context, info);
//     }
//     catch (error) {
//       if (error === 'role invalid type'){
//         console.log(`error authorize resolver ${info.fieldName}: roles debe ser un array: [] para acceso libre o  ['user', 'admin'] para acceso restringido`);
//         return handleError('Internal Error', 500)
//       }
//       else if (error === 'not authenticated'){
//         console.log(`error authorize resolver ${info.fieldName}: Debe estar logueado para acceder a este recurso`);
//         return handleError('Not authenticated', 403);
        
//       }
//       else if (error === 'not authorized'){
//         console.log(`error authorize resolver ${info.fieldName}: No tiene permiso para este recurso`);
//         return handleError('Not authorized', 403);
        
//       }
      
//     }
//   }
// }



// export default function withAuth(scope, callback) {
//   const next = callback ? callback : scope;

//   return async function(_, __, context, info) {
//     if (!context.auth) return new ContextError();
//     if (!context.auth.isAuthenticated)
//       return new AuthorizationError('Not Authenticated!');

//     let requiredScope = callback ? scope : null;

//     if (requiredScope && typeof requiredScope === 'function') {
//       requiredScope = await Promise.resolve().then(() =>
//         requiredScope(_, __, context, info),
//       );
//     }

//     if (
//       (requiredScope && requiredScope.length && !context.auth.scope) ||
//       (requiredScope &&
//         requiredScope.length &&
//         !validateScope(requiredScope, context.auth.scope))
//     ) {
//       return new AuthorizationError();
//     }

//     return next(_, __, context, info);
//   };
// }


// const isAuthenticated = (root, args, { user }) => user ? skip : new Error('Not authenticated')

// /**
//  * Sample resolver which returns an error in case user
//  * is not admin.
//  */
// const isAdmin = combineResolvers(
//   isAuthenticated,
//   (root, args, { user: { role } }) => role === 'admin' ? skip : new Error('Not authorized')
// )

// /**
//  * Sample sensitive information resolver, for admins only.
//  */
// const sensitive = combineResolvers(
//   isAdmin,
//   (root, args, { user: { name } }) => 'shhhh!'
// )

// // Resolver map
// const resolvers = { Query: { sensitive } }