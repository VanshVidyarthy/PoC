// import { Routes } from '@angular/router';
 
// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: '/home',
//     pathMatch: 'full'
//   },
//   {
//     path: 'login',
//     loadComponent: () => import('./features/security/components/login/login').then(m => m.Login),
//     title: 'Login - Bajaj ECommerce',
//   },
//   {
//     path: 'register',
//     loadComponent: () => import('./features/security/components/register-user/register-user').then(m => m.RegisterUser),
//     title: 'Register - Bajaj ECommerce',
//   },
//   {
//     path: 'cart',
//     loadComponent: () => import('./features/carts/components/cart-page/cart-page').then(m => m.CartPage),
//     title: 'Your Cart - Bajaj ECommerce',
//   },
//   {
//     path: 'payment',
//     loadComponent: () => import('./features/payments/components/payment-gateway/payment-gateway').then(m => m.PaymentGateway),
//     title: 'Payment - Bajaj ECommerce',
//     canActivate: [() => import('./features/security/services/auth.guard').then(m => m.authGuard)],
//   },
//   {
//     path: 'profile',
//     loadComponent: () => import('./features/security/components/profile/profile').then(m => m.Profile),
//     title: 'My Profile - Bajaj ECommerce',
//     canActivate: [() => import('./features/security/services/auth.guard').then(m => m.authGuard)],
//   },
//   {
//     path: 'orders',
//     loadComponent: () => import('./features/orders/components/orders-list/orders-list').then(m => m.OrdersList),
//     title: 'Your Orders - Bajaj ECommerce',
//     canActivate: [() => import('./features/security/services/auth.guard').then(m => m.authGuard)],
//   },
//   {
//     path: 'home',
//     loadComponent: () => import('./features/home/home').then(m => m.Home),
//     title: 'Bajaj ECommerce - Home',
//   },
//   {
//     path: 'products',
//     loadComponent: () => import('./features/products/components/products-list/products-list').then(m => m.ProductsList),
//     title: 'All Products - Bajaj ECommerce',
//   },
//   {
//     path: 'products/category/:categoryId',
//     loadComponent: () => import('./features/products/components/products-list/products-list').then(m => m.ProductsList),
//     title: 'Products by Category - Bajaj ECommerce',
//   },
//   {
//     path: 'product/:id',
//     loadComponent: () => import('./features/products/components/product-details/product-details').then(m => m.ProductDetails),
//     title: 'Product Details - Bajaj ECommerce',
//   },
//   {
//     path: 'categories',
//     loadComponent: () => import('./features/categories/components/categories-list/categories-list').then(m => m.CategoriesList),
//     title: 'Categories - Bajaj ECommerce',
//   },
//   {
//     path: 'category/:id',
//     loadComponent: () => import('./features/categories/components/category-details/category-details').then(m => m.CategoryDetails),
//     title: 'Category Details - Bajaj ECommerce',
//   },
//   {
//     path: 'register-product',
//     loadComponent: () => import('./features/products/components/register-product/register-product').then(m => m.RegisterProduct),
//     title: 'Register Product - Bajaj ECommerce',
//   },
//   {
//     path: 'register-category',
//     loadComponent: () => import('./features/categories/components/register-category/register-category').then(m => m.RegisterCategory),
//     title: 'Register Category - Bajaj ECommerce',
//   },
//   {
//     path: '**',
//     redirectTo: '/home'
//   }
// ];