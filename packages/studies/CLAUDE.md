# Studies Package Guidance

- Keep this package runtime-neutral. Shared study logic belongs at the package root; runtime adapters belong under explicit subdirectories such as `pinejs`.
- Do not import app-local charting-library declarations or proprietary runtime files here. Host apps pass runtime constants through adapter arguments.
- Prefer declarative metadata plus small rendering/calculation modules. App-specific data sources, account state, order state, and patched-chart hooks stay in the app.
- Keep public contribution candidates here. Internal chart overlays that depend on private Tealstreet state should remain app-local until they have a stable public contract.
