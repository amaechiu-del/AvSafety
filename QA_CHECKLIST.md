# QA Checklist

- [ ] Run `npm run lint`
- [ ] Run `npm test`
- [ ] Verify `/api/health` returns `status: ok`
- [ ] Confirm public `/api/db` hides registrations and exposes only `registrationCount`
- [ ] Confirm admin registration access still requires `x-admin-mode: true`
- [ ] Create a registration and confirm NDPA consent is stored
- [ ] Create a marketplace order and verify Paystack sandbox checkout initializes
- [ ] Verify sandbox payment confirmation updates order status to `APPROVED`
- [ ] Create a stakeholder, dispatch an invitation, and confirm follow-up scheduling
- [ ] Submit a memo and confirm it persists in the JSON database
- [ ] Run the Security workflow checks before release
- [ ] Run the Performance workflow before production deployment
