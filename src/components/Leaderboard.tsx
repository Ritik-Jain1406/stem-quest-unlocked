import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/stem';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardProps {
  currentUser: User;
}

// Mock leaderboard data since we're using localStorage
const MOCK_LEADERBOARD = [
  {
    id: '1',
    name: 'Alex Chen',
    xp: 2850,
    level: 3,
    badges: 12,
    rank: 1,
  },
  {
    id: '2', 
    name: 'Maria Rodriguez',
    xp: 2400,
    level: 3,
    badges: 9,
    rank: 2,
  },
  {
    id: '3',
    name: 'David Kim',
    xp: 2100,
    level: 3,
    badges: 8,
    rank: 3,
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    xp: 1850,
    level: 2,
    badges: 7,
    rank: 4,
  },
  {
    id: '5',
    name: 'Mike Thompson',
    xp: 1600,
    level: 2,
    badges: 6,
    rank: 5,
  },
];

export function Leaderboard({ currentUser }: LeaderboardProps) {
  // Add current user to leaderboard if not already there
  const currentUserEntry = {
    id: currentUser.id,
    name: currentUser.name,
    xp: currentUser.xp,
    level: currentUser.level,
    badges: currentUser.badges.length,
    rank: 0, // Will be calculated
  };

  const allEntries = [...MOCK_LEADERBOARD, currentUserEntry]
    .sort((a, b) => b.xp - a.xp)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-warning" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Award className="h-6 w-6 text-engineering" />;
      default:
        return <Trophy className="h-6 w-6 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allEntries.slice(0, 10).map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                entry.id === currentUser.id 
                  ? 'bg-primary/10 border-primary/20' 
                  : 'hover:bg-muted/50'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-12">
                {entry.rank <= 3 ? (
                  getRankIcon(entry.rank)
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">
                    #{entry.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`} />
                <AvatarFallback>
                  {entry.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{entry.name}</span>
                  {entry.id === currentUser.id && (
                    <Badge variant="outline" className="text-xs">You</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Level {entry.level} • {entry.badges} badges
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <div className="font-semibold text-primary">
                  {entry.xp.toLocaleString()} XP
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Position (if not in top 10) */}
        {allEntries.findIndex(e => e.id === currentUser.id) >= 10 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Your Position</h4>
            {(() => {
              const userEntry = allEntries.find(e => e.id === currentUser.id)!;
              return (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-center w-12">
                    <span className="text-lg font-bold text-primary">
                      #{userEntry.rank}
                    </span>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {userEntry.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{userEntry.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Level {userEntry.level} • {userEntry.badges} badges
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      {userEntry.xp.toLocaleString()} XP
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}