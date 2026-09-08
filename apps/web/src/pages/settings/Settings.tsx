import { Card, EmptyState } from "../../components/ui";

export function Settings() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>
            Manage your laundry application settings.
          </p>
        </div>
      </div>

      <Card>
        <EmptyState
          title="Settings"
          description="Ready for Phase 9"
        />
      </Card>
    </section>
  );
}