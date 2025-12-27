import { motion } from 'framer-motion';
import { GitBranch, Eye, Sparkles, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { STATS, CHART_DATA, PULL_REQUESTS } from '@/lib/constants';
import { ActivityChart } from '@/components/charts/ActivityChart';
import { RecentPRsTable } from '@/components/dashboard/RecentPRsTable';
import { QuickActions } from '@/components/dashboard/QuickActions';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your AI code reviews.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Connected Repos"
            value={STATS.connectedRepos}
            change="+3 this month"
            changeType="positive"
            icon={GitBranch}
            delay={0}
          />
          <StatCard
            title="PRs Reviewed"
            value={STATS.pullRequestsReviewed.toLocaleString()}
            change="+127 this week"
            changeType="positive"
            icon={Eye}
            delay={0.1}
          />
          <StatCard
            title="AI Reviews"
            value={STATS.aiReviewsGenerated.toLocaleString()}
            change="+234 this week"
            changeType="positive"
            icon={Sparkles}
            delay={0.2}
          />
          <StatCard
            title="Success Rate"
            value={`${STATS.successRate}%`}
            change="+2.1% vs last month"
            changeType="positive"
            icon={CheckCircle2}
            delay={0.3}
          />
        </motion.div>

        {/* Charts and Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <ActivityChart data={CHART_DATA.prActivity} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <QuickActions />
          </motion.div>
        </div>

        {/* Recent PRs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <RecentPRsTable pullRequests={PULL_REQUESTS} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
