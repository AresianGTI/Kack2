// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from "../../core/auth.service";
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(
//     public authService: AuthService,
//     public router: Router
//   ) { }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     const user = this.authService;
//     if (user) {
//         // check if route is restricted by role
//         // if (route.data.roles && route.data.roles.indexOf(user.role) === -1) {
//         //     // role not authorised so redirect to home page
//         //     this.router.navigate(['/']);
//         //     return false;
//         // }

//         // authorised so return true
//         return true;
//     }

//     // not logged in so redirect to login page with the return url
//     this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
//     return false;
// }
// }

