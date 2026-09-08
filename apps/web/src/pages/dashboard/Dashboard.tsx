import { Card, EmptyState } from "../../components/ui";

export function Dashboard() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Good morning 👋</h2>
          <p>
            Here's what's happening with your laundry business today.
          </p>
        </div>
      </div>

      <Card>
        <EmptyState
          title="Dashboard"
          description="Statistik dan data PostgreSQL akan masuk setelah API layer selesai."
        />
      </Card>
    </section>
  );
}