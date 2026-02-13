import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import {
  MessageSquare,
  Image,
  Settings,
  TrendingUp,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
  totalGalleryImages: number;
  totalServices: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const { sessionId } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard", {
          headers: {
            "x-admin-session": sessionId || "",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchStats();
    }
  }, [sessionId]);

  const statCards = [
    {
      label: "Total Messages",
      value: stats?.totalMessages || 0,
      icon: MessageSquare,
      color: "bg-blue-500/10",
      iconColor: "text-blue-500",
      link: "/admin/messages",
    },
    {
      label: "Unread Messages",
      value: stats?.unreadMessages || 0,
      icon: Mail,
      color: "bg-red-500/10",
      iconColor: "text-red-500",
      link: "/admin/messages",
    },
    {
      label: "Gallery Images",
      value: stats?.totalGalleryImages || 0,
      icon: Image,
      color: "bg-green-500/10",
      iconColor: "text-green-500",
      link: "/admin/gallery",
    },
    {
      label: "Total Services",
      value: stats?.totalServices || 0,
      icon: Settings,
      color: "bg-purple-500/10",
      iconColor: "text-purple-500",
      link: "/admin/services",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin control panel
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Link
                key={index}
                to={card.link}
                className="bg-card border border-border rounded-lg p-6 hover:border-accent hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {card.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.color} rounded-lg p-3`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
          </div>

          {stats && stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between pb-4 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-foreground">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.message}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No recent activity
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/messages"
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 hover:bg-blue-500/20 transition-colors"
          >
            <MessageSquare className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-foreground mb-1">
              View Messages
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage contact form submissions
            </p>
          </Link>

          <Link
            to="/admin/gallery"
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 hover:bg-green-500/20 transition-colors"
          >
            <Image className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Manage Gallery</h3>
            <p className="text-sm text-muted-foreground">
              Upload and organize images
            </p>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6 hover:bg-purple-500/20 transition-colors"
          >
            <Settings className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your admin panel
            </p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
