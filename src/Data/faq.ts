interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const gettingStartedFaq: FaqItem[] = [
  {
    id: "item1-1",
    question: `Why can't I text on the scan2pay.direct Telegram channel? What should I do?`,
    answer: `When you join the scan2pay.direct India community channel for the first time, you'll see a welcome message under the "Verify (For New Members)" topic. To start texting in the group, you need to click the verification prompt in that message and complete a simple CAPTCHA.`,
  },
  {
    id: "item1-2",
    question: `Where to Find Your Order or Transaction History on scan2pay.direct`,
    answer: `Go to the 'Transactions' section in the app to see your orders, deposits, withdrawals, and disputes.`,
  },
];
export const generalFaq: FaqItem[] = [
  {
    id: "item2-1",
    question: `What is scan2pay.direct?`,
    answer: `scan2pay.direct is a global platform that lets you easily buy, sell, and pay using USDT BEP-20 — securely and privately. It supports popular local payment methods like UPI, PIX, and QRIS, while keeping your funds fully in your control.`,
  },
  {
    id: "item2-2",
    question: `Is scan2pay.direct safe to use?`,
    answer: `Yes. scan2pay.direct is designed with user safety at its core. All merchants on the platform are personally verified. Before onboarding, they must submit zero-knowledge proofs (ZK-proofs) of their banking activity to prove that they are legitimate, active users with no history of bank freezes or fraudulent behavior. This makes merchant funds secure and transactions trustworthy.`,
  },
];
export const myLimitsFaq: FaqItem[] = [
  {
    id: "item3-1",
    question: `Where can I check my transaction limits?`,
    answer: `Go to the “My Limits” page in the homepage menu to view your buy and sell/pay limits.`,
  },
  {
    id: "item3-2",
    question: `Are buy and sell limits tracked separately?`,
    answer: `Yes — your buy and sell limits are independent and increase based on usage.`,
  },
];
export const depositAndWithdrawFaq: FaqItem[] = [
  {
    id: "item4-1",
    question: `Are deposits and withdrawals gasless?`,
    answer: `Yes – all transactions on scan2pay.direct are completely gasless, including deposits, withdrawals, and trades when using your in-app wallet on the BNB Smart Chain network.`,
  },
  {
    id: "item4-2",
    question: `What networks are supported for deposits?`,
    answer: `Currently, USDT BEP-20 on BNB Smart Chain network is the only supported deposit method. If your funds are on a different chain, use the Cross-Chain Deposit option powered by Rango Exchange. We are expanding soon!!`,
  },
];
export const referAndEarnFaq: FaqItem[] = [
  {
    id: "item5-1",
    question: `What is Refer & Earn on scan2pay.direct?`,
    answer: `Refer & Earn is your chance to earn passive rewards by inviting trusted users to trade on scan2pay.direct. Once eligible, you can generate a referral link, share it, and earn 1% of the total trading volume of users who join through your link.`,
  },
  {
    id: "item5-2",
    question: `How much can I earn?`,
    answer: `You earn 1% of every trade made by the users you have referred. There's no upper limit — the more they trade, the more you earn.`,
  },
];
export const transactionFaq: FaqItem[] = [
  {
    id: "item6-1",
    question: `Where can I view all my transactions on scan2pay.direct?`,
    answer: `Go to the Transactions section in the app to view all your activity including deposits, withdrawals and disputes.`,
  },
  {
    id: "item6-2",
    question: `Can I download my transaction history?`,
    answer: `Yes! You can download the history of your completed orders directly from the Transactions section.`,
  },
];
export const allFaq: FaqItem[] = [
  ...gettingStartedFaq,
  ...generalFaq,
  ...myLimitsFaq,
  ...depositAndWithdrawFaq,
  ...referAndEarnFaq,
  ...transactionFaq,
];
