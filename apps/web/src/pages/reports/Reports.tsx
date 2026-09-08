import { Card, EmptyState } from "../../components/ui";

export function Reports() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Reports</h2>
          <p>
            Monitor your laundry business performance.
          </p>
        </div>
      </div>

      <Card>
        <EmptyState
          title="Reports"
          description="Ready for Phase 8"
        />
      </Card>
    </section>
  );
}