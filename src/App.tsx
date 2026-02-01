import React, { useState, useEffect } from 'react';

// Types
interface Player {
  id: number;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';
  country: string;
  basePrice: number;
  currentBid: number;
  soldTo: string | null;
  stats: { matches: number; runs?: number; wickets?: number; avg?: number };
}

interface Team {
  id: number;
  name: string;
  shortName: string;
  color: string;
  budget: number;
  players: Player[];
}

interface Match {
  id: number;
  team1: string;
  team2: string;
  team1Score: { runs: number; wickets: number; overs: number };
  team2Score: { runs: number; wickets: number; overs: number };
  status: 'upcoming' | 'live' | 'completed';
  result?: string;
}

// Initial Data
const initialPlayers: Player[] = [
  { id: 1, name: 'Virat Kohli', role: 'Batsman', country: '🇮🇳', basePrice: 200, currentBid: 200, soldTo: null, stats: { matches: 237, runs: 7263, avg: 37.25 } },
  { id: 2, name: 'Jasprit Bumrah', role: 'Bowler', country: '🇮🇳', basePrice: 150, currentBid: 150, soldTo: null, stats: { matches: 120, wickets: 145, avg: 23.5 } },
  { id: 3, name: 'Ben Stokes', role: 'All-Rounder', country: '🇬🇧', basePrice: 180, currentBid: 180, soldTo: null, stats: { matches: 104, runs: 2924, wickets: 74 } },
  { id: 4, name: 'Jos Buttler', role: 'Wicket-Keeper', country: '🇬🇧', basePrice: 160, currentBid: 160, soldTo: null, stats: { matches: 89, runs: 2838, avg: 41.14 } },
  { id: 5, name: 'Pat Cummins', role: 'Bowler', country: '🇦🇺', basePrice: 140, currentBid: 140, soldTo: null, stats: { matches: 76, wickets: 98, avg: 28.3 } },
  { id: 6, name: 'Rashid Khan', role: 'Bowler', country: '🇦🇫', basePrice: 120, currentBid: 120, soldTo: null, stats: { matches: 92, wickets: 112, avg: 21.8 } },
  { id: 7, name: 'Suryakumar Yadav', role: 'Batsman', country: '🇮🇳', basePrice: 130, currentBid: 130, soldTo: null, stats: { matches: 65, runs: 2141, avg: 44.6 } },
  { id: 8, name: 'Mitchell Starc', role: 'Bowler', country: '🇦🇺', basePrice: 150, currentBid: 150, soldTo: null, stats: { matches: 68, wickets: 89, avg: 26.1 } },
];

const initialTeams: Team[] = [
  { id: 1, name: 'Royal Strikers', shortName: 'RST', color: '#E91E63', budget: 1000, players: [] },
  { id: 2, name: 'Thunder Kings', shortName: 'THK', color: '#9C27B0', budget: 1000, players: [] },
  { id: 3, name: 'Phoenix Warriors', shortName: 'PHW', color: '#FF5722', budget: 1000, players: [] },
  { id: 4, name: 'Ocean Titans', shortName: 'OCT', color: '#00BCD4', budget: 1000, players: [] },
];

const initialMatches: Match[] = [
  { id: 1, team1: 'Royal Strikers', team2: 'Thunder Kings', team1Score: { runs: 187, wickets: 4, overs: 20 }, team2Score: { runs: 156, wickets: 8, overs: 18.3 }, status: 'live' },
  { id: 2, team1: 'Phoenix Warriors', team2: 'Ocean Titans', team1Score: { runs: 0, wickets: 0, overs: 0 }, team2Score: { runs: 0, wickets: 0, overs: 0 }, status: 'upcoming' },
  { id: 3, team1: 'Royal Strikers', team2: 'Phoenix Warriors', team1Score: { runs: 165, wickets: 6, overs: 20 }, team2Score: { runs: 168, wickets: 3, overs: 18.4 }, status: 'completed', result: 'Phoenix Warriors won by 7 wickets' },
];

// Components
const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; icon: string }> = ({ active, onClick, children, icon }) => (
  <button
    onClick={onClick}
    className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base transition-all duration-300 border-b-2 flex items-center gap-2 ${
      active ? 'tab-active border-amber-400 text-amber-400' : 'border-transparent text-gray-400 hover:text-amber-300 hover:bg-white/5'
    }`}
  >
    <span className="text-lg sm:text-xl">{icon}</span>
    <span className="hidden sm:inline">{children}</span>
  </button>
);

const PlayerCard: React.FC<{ player: Player; onBid: (id: number, amount: number) => void; teams: Team[]; onSell: (playerId: number, teamId: number) => void }> = ({ player, onBid, teams, onSell }) => {
  const [showBidding, setShowBidding] = useState(false);
  const roleColors: Record<string, string> = {
    'Batsman': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Bowler': 'bg-green-500/20 text-green-400 border-green-500/30',
    'All-Rounder': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Wicket-Keeper': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <div className="player-card card-glass rounded-2xl p-5 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-3xl mr-2">{player.country}</span>
          <h3 className="text-xl font-bold text-white mt-1">{player.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleColors[player.role]}`}>
          {player.role}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-500">Matches</div>
          <div className="font-mono text-amber-400 font-semibold">{player.stats.matches}</div>
        </div>
        {player.stats.runs !== undefined && (
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500">Runs</div>
            <div className="font-mono text-amber-400 font-semibold">{player.stats.runs}</div>
          </div>
        )}
        {player.stats.wickets !== undefined && (
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500">Wickets</div>
            <div className="font-mono text-amber-400 font-semibold">{player.stats.wickets}</div>
          </div>
        )}
        {player.stats.avg !== undefined && (
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500">Avg</div>
            <div className="font-mono text-amber-400 font-semibold">{player.stats.avg}</div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-500">Base Price</div>
            <div className="font-mono text-gray-400">₹{player.basePrice}L</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Current Bid</div>
            <div className="font-mono text-2xl text-gradient font-bold">₹{player.currentBid}L</div>
          </div>
        </div>

        {player.soldTo ? (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-center">
            <span className="text-green-400 font-semibold">SOLD to {player.soldTo}</span>
          </div>
        ) : showBidding ? (
          <div className="space-y-2 animate-slide-up">
            <div className="flex gap-2">
              <button onClick={() => onBid(player.id, 10)} className="bid-btn flex-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 py-2 rounded-lg font-semibold transition-all">+₹10L</button>
              <button onClick={() => onBid(player.id, 25)} className="bid-btn flex-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 py-2 rounded-lg font-semibold transition-all">+₹25L</button>
              <button onClick={() => onBid(player.id, 50)} className="bid-btn flex-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 py-2 rounded-lg font-semibold transition-all">+₹50L</button>
            </div>
            <select
              onChange={(e) => e.target.value && onSell(player.id, parseInt(e.target.value))}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transition-all cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>🔨 SELL TO TEAM</option>
              {teams.filter(t => t.budget >= player.currentBid).map(team => (
                <option key={team.id} value={team.id}>{team.name} (₹{team.budget}L)</option>
              ))}
            </select>
          </div>
        ) : (
          <button
            onClick={() => setShowBidding(true)}
            className="w-full gradient-gold text-black py-3 rounded-xl font-bold hover:opacity-90 transition-all animate-pulse-glow"
          >
            START BIDDING
          </button>
        )}
      </div>
    </div>
  );
};

const TeamCard: React.FC<{ team: Team }> = ({ team }) => (
  <div className="card-glass rounded-2xl overflow-hidden">
    <div className="p-5" style={{ borderTop: `4px solid ${team.color}` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl" style={{ backgroundColor: team.color + '30', color: team.color }}>
            {team.shortName}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{team.name}</h3>
            <div className="text-sm text-gray-400">{team.players.length} Players</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Budget Left</div>
          <div className="font-mono text-xl font-bold" style={{ color: team.color }}>₹{team.budget}L</div>
        </div>
      </div>

      {team.players.length > 0 ? (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {team.players.map(player => (
            <div key={player.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span>{player.country}</span>
                <span className="text-white text-sm">{player.name}</span>
              </div>
              <span className="font-mono text-amber-400 text-sm">₹{player.currentBid}L</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No players acquired yet
        </div>
      )}
    </div>
  </div>
);

const LiveMatchCard: React.FC<{ match: Match; onUpdateScore: (matchId: number, team: 'team1' | 'team2', runs: number, isWicket: boolean) => void }> = ({ match, onUpdateScore }) => {
  const getStatusBadge = () => {
    switch (match.status) {
      case 'live':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-bold"><span className="w-2 h-2 bg-red-500 rounded-full animate-live" />LIVE</span>;
      case 'upcoming':
        return <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full text-xs font-bold">UPCOMING</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full text-xs font-bold">COMPLETED</span>;
    }
  };

  return (
    <div className="card-glass rounded-2xl p-5 relative overflow-hidden">
      {match.status === 'live' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
      
      <div className="flex items-center justify-between mb-4">
        {getStatusBadge()}
        <span className="text-gray-500 text-sm">Match #{match.id}</span>
      </div>

      <div className="space-y-4">
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
              {match.team1.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-white font-semibold">{match.team1}</span>
          </div>
          <div className="font-mono text-2xl text-white">
            {match.team1Score.runs}/{match.team1Score.wickets}
            <span className="text-gray-500 text-sm ml-2">({match.team1Score.overs})</span>
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              {match.team2.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-white font-semibold">{match.team2}</span>
          </div>
          <div className="font-mono text-2xl text-white">
            {match.team2Score.runs}/{match.team2Score.wickets}
            <span className="text-gray-500 text-sm ml-2">({match.team2Score.overs})</span>
          </div>
        </div>
      </div>

      {match.status === 'completed' && match.result && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-center text-green-400 font-semibold">{match.result}</p>
        </div>
      )}

      {match.status === 'live' && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-gray-500 mb-2 text-center">Quick Score Update</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-gray-400 text-center">{match.team2}</div>
              <div className="flex gap-1">
                {[1, 4, 6].map(r => (
                  <button key={r} onClick={() => onUpdateScore(match.id, 'team2', r, false)} className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 py-2 rounded-lg text-sm font-bold transition-all">
                    +{r}
                  </button>
                ))}
                <button onClick={() => onUpdateScore(match.id, 'team2', 0, true)} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg text-sm font-bold transition-all">
                  W
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StandingsTable: React.FC<{ teams: Team[]; matches: Match[] }> = ({ teams, matches }) => {
  const standings = teams.map(team => {
    const teamMatches = matches.filter(m => m.status === 'completed' && (m.team1 === team.name || m.team2 === team.name));
    const wins = teamMatches.filter(m => m.result?.includes(team.name + ' won')).length;
    const losses = teamMatches.length - wins;
    return { ...team, played: teamMatches.length, wins, losses, points: wins * 2 };
  }).sort((a, b) => b.points - a.points);

  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-display text-2xl text-gradient">TOURNAMENT STANDINGS</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">#</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">TEAM</th>
              <th className="text-center p-4 text-gray-400 font-semibold text-sm">P</th>
              <th className="text-center p-4 text-gray-400 font-semibold text-sm">W</th>
              <th className="text-center p-4 text-gray-400 font-semibold text-sm">L</th>
              <th className="text-center p-4 text-gray-400 font-semibold text-sm">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => (
              <tr key={team.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: team.color + '30', color: team.color }}>
                      {team.shortName}
                    </div>
                    <span className="text-white font-semibold">{team.name}</span>
                  </div>
                </td>
                <td className="p-4 text-center font-mono text-gray-300">{team.played}</td>
                <td className="p-4 text-center font-mono text-green-400">{team.wins}</td>
                <td className="p-4 text-center font-mono text-red-400">{team.losses}</td>
                <td className="p-4 text-center font-mono text-2xl text-gradient font-bold">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main App
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'auction' | 'teams' | 'matches' | 'standings'>('auction');
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleBid = (playerId: number, amount: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, currentBid: p.currentBid + amount } : p
    ));
  };

  const handleSell = (playerId: number, teamId: number) => {
    const player = players.find(p => p.id === playerId);
    const team = teams.find(t => t.id === teamId);
    if (!player || !team) return;

    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, soldTo: team.name } : p
    ));

    setTeams(prev => prev.map(t => 
      t.id === teamId 
        ? { ...t, budget: t.budget - player.currentBid, players: [...t.players, { ...player, soldTo: team.name }] }
        : t
    ));
  };

  const handleUpdateScore = (matchId: number, team: 'team1' | 'team2', runs: number, isWicket: boolean) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const scoreKey = team === 'team1' ? 'team1Score' : 'team2Score';
      const currentScore = m[scoreKey];
      return {
        ...m,
        [scoreKey]: {
          runs: currentScore.runs + runs,
          wickets: isWicket ? currentScore.wickets + 1 : currentScore.wickets,
          overs: currentScore.overs + (isWicket || runs > 0 ? 0.1 : 0)
        }
      };
    }));
  };

  const unsoldPlayers = players.filter(p => !p.soldTo);
  const soldPlayers = players.filter(p => p.soldTo);

  return (
    <div className="min-h-screen gradient-dark stadium-pattern relative">
      <div className="noise-overlay" />
      
      {/* Header */}
      <header className={`relative z-10 border-b border-white/10 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl gradient-gold flex items-center justify-center text-3xl sm:text-4xl animate-pulse-glow">
                🏏
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-5xl text-gradient tracking-wide">CRICKET AUCTION HUB</h1>
                <p className="text-gray-400 text-sm sm:text-base">Premier League Season 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="font-mono text-xl sm:text-2xl text-white">{unsoldPlayers.length}</div>
                <div className="text-xs text-gray-500">UNSOLD</div>
              </div>
              <div className="w-px h-8 sm:h-10 bg-white/20" />
              <div className="text-center">
                <div className="font-mono text-xl sm:text-2xl text-gradient">{soldPlayers.length}</div>
                <div className="text-xs text-gray-500">SOLD</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`relative z-10 border-b border-white/10 bg-black/30 backdrop-blur sticky top-0 transition-all duration-700 delay-100 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center sm:justify-start overflow-x-auto">
            <TabButton active={activeTab === 'auction'} onClick={() => setActiveTab('auction')} icon="🔨">Auction</TabButton>
            <TabButton active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} icon="👥">Teams</TabButton>
            <TabButton active={activeTab === 'matches'} onClick={() => setActiveTab('matches')} icon="🏟️">Matches</TabButton>
            <TabButton active={activeTab === 'standings'} onClick={() => setActiveTab('standings')} icon="🏆">Standings</TabButton>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`relative z-10 max-w-7xl mx-auto px-4 py-6 sm:py-8 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {activeTab === 'auction' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-white">PLAYER AUCTION</h2>
                <p className="text-gray-400">Place your bids and build your dream team</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-live" />
                <span className="text-red-400 font-semibold text-sm">AUCTION LIVE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {players.map((player, idx) => (
                <div key={player.id} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <PlayerCard player={player} onBid={handleBid} teams={teams} onSell={handleSell} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl sm:text-3xl text-white">TEAM MANAGEMENT</h2>
              <p className="text-gray-400">View team rosters and remaining budgets</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {teams.map((team, idx) => (
                <div key={team.id} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <TeamCard team={team} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl sm:text-3xl text-white">LIVE SCORING</h2>
              <p className="text-gray-400">Real-time match updates and score tracking</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {matches.map((match, idx) => (
                <div key={match.id} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <LiveMatchCard match={match} onUpdateScore={handleUpdateScore} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="animate-slide-up">
            <div className="mb-6">
              <h2 className="font-display text-2xl sm:text-3xl text-white">TOURNAMENT STANDINGS</h2>
              <p className="text-gray-400">Current points table and team rankings</p>
            </div>
            <StandingsTable teams={teams} matches={matches} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 text-xs">
              Requested by <span className="text-gray-500">@jontyjr55882</span> · Built by <span className="text-gray-500">@clonkbot</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;