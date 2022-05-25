# Remix Root Route Re-render Problem Reproduction

To reproduce what I believe to be incorrect behavior:

0. Install the project dependencies with your preferred package manager, then boot the app with the `dev` script.
1. Navigate to [`http://localhost:3000/login`](http://localhost:3000/login) and key in an email address (or faceroll the keyboard), then submit the form.
2. The `/login` form first sets a `session` cookie with the entered email/text.  Then, it performs a redirect in Remix first to the index route, `/`.  The index route `loader`, in turn, redirects to `/content`.
3. During the navigation to `/content`, the root route's `loader` function fires and reads the `session` cookie (as a `console.log` in that function reveals).  The `loader` returns the value of the cookie to the root route component.  As a result, **I would expect that the `useLoaderData` invocation in the root route component would receive the value of the cookie, however the value of the hook remains an empty object even once `/content` has loaded.**
4. A page refresh of `/content` causes another invocation of the root route `loader`; this time, the root route `useLoaderData` *does* receive the result of the `loader` as I would expect.

This behavior of step (3) appears to expose a potential bug in Remix -- perhaps in some data fetching optimization logic.  I would be inclined to believe I've misunderstood the heuristic(s) which govern when parent/layout routes are rendered were it not for the fact that the root route loader *does* run across the login redirect sequence.

## A clue...

I noticed that if there is only a single redirect performed... e.g.

- the `/login` form redirects directly to `/content`;
- OR the `login` form redirects to `/`, but the `/` index route's `loader` does not redirect but rather renders a component itself...

...then the root route component behaves as I would expect without a subsequent page refresh.  Ergo, I'm led to believe that the multi-`redirect` may be at fault.