import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './routes/Login.jsx'
import Signup from './routes/Signup.jsx'
import Home from './routes/Home.jsx'
import Item from './routes/Item.jsx'
import ListItem from './routes/ListItem.jsx'
import NotFound from './routes/NotFound.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Watchlist from './routes/WatchList.jsx'
import CreateListing from './routes/CreateListing.jsx'
import AuthGuard from './routes/AuthGuard.jsx'
import { AuthProvider } from './routes/AuthContext.jsx'
import UserListings from './routes/UserListings.jsx'
import ChatBox from './routes/ChatBox.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/home",
    element: (
      <AuthGuard>
        <Home />
      </AuthGuard>
    )
  },
  {
    path: '/item/:id',
    element: (
      <AuthGuard>
        <Item />
      </AuthGuard>
    ),
  },
  {
    path: "/list-item",
    element: (
      <AuthGuard>
        <ListItem />
      </AuthGuard>
    )
  },
  {
    path: "/watchlist",
    element: (
      <AuthGuard>
        <Watchlist />
      </AuthGuard>
    )
  },
  {
    path: "/create-listing",
    element: (
      <AuthGuard>
        <CreateListing />
      </AuthGuard>
    )
  },
  {
    path: "/user-listings",
    element: (
      <AuthGuard>
        <UserListings />
      </AuthGuard>
    )
  },
  {
    path: "/chat",
    element: (
      <AuthGuard>
        <ChatBox />
      </AuthGuard>
    )
  },
  {
    path: "/chat/:email",
    element: (
      <AuthGuard>
        <ChatBox />
      </AuthGuard>
    )
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
