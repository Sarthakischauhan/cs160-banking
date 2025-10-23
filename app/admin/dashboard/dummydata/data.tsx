import { MetricCardProps } from "../components/metric-card";

export const metricslist: MetricCardProps[] = [
  {
    title: "Total Users",
    value: 1500,
    change: 35,
    description: "Number of registered users",
  },
  {
    title: "Transactions Today",
    value: 320,
    change: 50,
    description: "Number of transactions processed today",
  },
  {
    title: "Pending Transfers",
    value: 12,
    change: -3,
    description: "Number of pending transfers",
  },
];

export const trendsData1 = {
  title: "Money Transferred Daily",

  data: [
    { date: "2025-09-21", amount: 1420 },
    { date: "2025-09-22", amount: 1560 },
    { date: "2025-09-23", amount: 1325 },
    { date: "2025-09-24", amount: 1840 },
    { date: "2025-09-25", amount: 1760 },
    { date: "2025-09-26", amount: 2100 },
    { date: "2025-09-27", amount: 1920 },
    { date: "2025-09-28", amount: 2260 },
    { date: "2025-09-29", amount: 1980 },
    { date: "2025-09-30", amount: 2410 },
    { date: "2025-10-01", amount: 2580 },
    { date: "2025-10-02", amount: 2440 },
    { date: "2025-10-03", amount: 2320 },
    { date: "2025-10-04", amount: 2710 },
    { date: "2025-10-05", amount: 2650 },
    { date: "2025-10-06", amount: 2490 },
    { date: "2025-10-07", amount: 2900 },
    { date: "2025-10-08", amount: 3010 },
    { date: "2025-10-09", amount: 2840 },
    { date: "2025-10-10", amount: 3200 },
    { date: "2025-10-11", amount: 3100 },
    { date: "2025-10-12", amount: 3050 },
    { date: "2025-10-13", amount: 3340 },
    { date: "2025-10-14", amount: 3210 },
    { date: "2025-10-15", amount: 3520 },
    { date: "2025-10-16", amount: 3660 },
    { date: "2025-10-17", amount: 3400 },
    { date: "2025-10-18", amount: 3710 },
    { date: "2025-10-19", amount: 3820 },
    { date: "2025-10-20", amount: 4000 },
  ],
};

export const supportTickets = [
  {
    ticketId: "SUP-1023",
    user: "Kevin Chen",
    subject: "Unable to link new debit card",
    priority: "Medium",
    status: "Open",
    createdAt: "2025-10-21T18:24:00Z",
  },
  {
    ticketId: "SUP-1024",
    user: "Maria Lopez",
    subject: "Transfer failed but balance deducted",
    priority: "High",
    status: "In Progress",
    createdAt: "2025-10-22T09:15:00Z",
  },
  {
    ticketId: "SUP-1025",
    user: "David Wilson",
    subject: "Need help resetting 2FA device",
    priority: "Low",
    status: "Resolved",
    createdAt: "2025-10-20T13:02:00Z",
  },
  {
    ticketId: "SUP-1026",
    user: "Hannah Nguyen",
    subject: "Account locked after multiple failed logins",
    priority: "High",
    status: "Open",
    createdAt: "2025-10-22T11:05:00Z",
  },
];

export const pendingTransfers = [
  {
    id: "TXN-82341",
    sender: "Michael Johnson",
    recipient: "Samantha Lee",
    amount: 420.5,
    date: "2025-10-22T10:45:00Z",
    status: "Pending Approval",
  },
  {
    id: "TXN-82342",
    sender: "Emily Davis",
    recipient: "Acme Corp.",
    amount: 9750.0,
    date: "2025-10-22T09:30:00Z",
    status: "Awaiting Review",
  },
  {
    id: "TXN-82343",
    sender: "Daniel Martinez",
    recipient: "John Smith",
    amount: 62.25,
    date: "2025-10-21T16:12:00Z",
    status: "Processing",
  },
  {
    id: "TXN-82344",
    sender: "Olivia Brown",
    recipient: "QuickPay Inc.",
    amount: 1340.0,
    date: "2025-10-21T14:10:00Z",
    status: "Pending Approval",
  },
];