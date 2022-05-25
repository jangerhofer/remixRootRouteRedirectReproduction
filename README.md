# Remix Root Route Rerender Problem Reproduction

To reproduce what I believe to be incorrect behavior:

0. Install the project dependencies with your preferred package manager, then boot the app with the `dev` script.
1. Navigate to [`http://localhost:3000/login`](http://localhost:3000/login) and key in an email address (or faceroll the keyboard), then submit the form.
2. The `/login` form will first set a `session` cookie with the entered email/text.  Then, it performs a redirect in Remix first to the index route, `/`.  The index route `loader` will finally redirect to `/content`.
3. During the journey to `/content`, the root route's `loader` function fires and reads the `session` cookie (as a `console.log` in that function reveals).  **I expect that the root route `loader` would return that email to the root route component, however the `useLoaderData` invocation in the root route component, does *not* immediately reflect the new value.**
4. A page refresh of `/content` causes the root route `loader` to once again read the `session` cookie *and* the root route `useLoaderData` receives the result of the `loader`, as I would expect.


This behavior of step (3) appears to expose a potential bug in Remix -- perhaps some re-render optimization logic.  I would be inclined to believe I've misunderstood the heuristic(s) which govern when `loader`s are run were it not for the fact that the root route loader *does* run.  The bug comprises only root route component's `useLoaderData` lack of a value when the `loader` function is clearly returning a value!

One final note is that if the intermediate redirect in the `/login` --> `/` --> `/content` chain is removed -- i.e. if the `/login` action redirects directly to `/content` -- then the root route behaves as I would expect.  Ergo, I'm led to believe that the multi-`redirect` may be at fault.