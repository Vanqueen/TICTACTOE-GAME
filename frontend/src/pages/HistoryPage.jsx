import GameHistory from "../components/GameHistory";

function HistoryPage() {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          📈 Historique des Parties
        </h1>
        <div className="flex justify-center">
          <GameHistory />
        </div>
      </div>
    </main>
  );
}

export default HistoryPage;