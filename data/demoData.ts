import { ResearchData, Book } from '../types';

export const DEMO_RESEARCH = {
    summary: "Dropshipping is a retail fulfillment method where sellers don't keep products in stock. Instead, they transfer customer orders to suppliers who ship directly. While marketed as 'passive income,' the reality involves 85%+ failure rates, razor-thin margins (5-15%), and constant platform/supplier issues.",
    ethicalRating: 3,
    profitPotential: "Low for 90%+, Moderate for those with significant capital and expertise",
    marketStats: [
        { label: "Failure Rate (Year 1)", value: "85-90%", context: "Most quit within 6 months due to no sales or negative ROI" },
        { label: "Median Monthly Profit", value: "$200-500", context: "After 6+ months, excluding the 85% who make $0" },
        { label: "Average Startup Cost", value: "$2,000-5,000", context: "Real cost including ads, apps, samples - not the '$50' gurus claim" },
        { label: "Market Saturation", value: "Extreme", context: "Same products sold by 1000s of stores with identical margins" }
    ],
    hiddenCosts: [
        { label: "Shopify + Apps", value: "$100-300/mo", context: "Basic store, email, reviews, upsells add up fast" },
        { label: "Ad Spend (Minimum)", value: "$500-2000/mo", context: "Required to test products; most is wasted on non-converters" },
        { label: "Product Samples", value: "$200-500", context: "To verify quality before selling - often reveals supplier issues" },
        { label: "Refunds/Chargebacks", value: "10-20% of revenue", context: "Long shipping times = angry customers = disputes" }
    ],
    caseStudies: [
        {
            name: "Mike T.",
            type: "LOSER",
            background: "30yo software engineer looking for side income",
            strategy: "Followed YouTube guru course, sold pet products",
            outcome: "Spent $4,200 on ads, made $800 in sales, quit after 4 months",
            revenue: "-$3,400"
        },
        {
            name: "Sarah K.",
            type: "LOSER",
            background: "Stay-at-home mom, saved $2,000 to start",
            strategy: "General store approach, Facebook ads",
            outcome: "Store suspended for policy violations, supplier ghosted her",
            revenue: "-$2,000"
        },
        {
            name: "James L.",
            type: "WINNER",
            background: "Former Amazon FBA seller with $50k capital",
            strategy: "Branded store, US suppliers, premium pricing",
            outcome: "After 18 months and multiple pivots, hit $15k/mo profit",
            revenue: "$15,000/mo"
        }
    ],
    affiliates: [
        { program: "Shopify Partner", potential: "High", type: "WRITER", commission: "$58-150 per signup", notes: "Every guru is a Shopify affiliate" },
        { program: "Oberlo/DSers", potential: "Medium", type: "PARTICIPANT", commission: "20-30% recurring", notes: "Dropship apps pay recurring for referrals" },
        { program: "Course Sales", potential: "Very High", type: "WRITER", commission: "$200-1000 per sale", notes: "The real money: selling the dream, not doing it" }
    ]
};

export const DEMO_BOOK: Book = {
    title: "The Dropshipping Delusion",
    subtitle: "Why 90% Fail and What They Won't Tell You",
    frontCover: {
        titleText: "THE DROPSHIPPING DELUSION",
        subtitleText: "The Uncomfortable Truth About 'Passive Income'",
        visualDescription: "A shattered laptop screen showing an empty Shopify dashboard, surrounded by unpaid bills and a 'GURU COURSE COMPLETE' certificate"
    },
    backCover: {
        blurb: "Everyone's selling the dream. We're selling the truth. Before you invest your savings in another 'proven system,' read what 85% of dropshippers wish they'd known.",
        visualDescription: "Stack of returns packages and a sad cartoon wallet with moths flying out"
    },
    chapters: [
        {
            number: 1,
            title: "THE LIE: Passive Income from Your Couch",
            content: "## The Seductive Promise\n\nScroll through YouTube for five minutes and you'll see it: a 22-year-old in a rented Lamborghini telling you how he makes $50,000/month 'while sleeping.' The formula is always the same:\n\n1. Find a winning product\n2. Create a store (10 minutes!)\n3. Run some Facebook ads\n4. Watch the money roll in\n\n**The Reality Check**\n\nHere's what those thumbnails don't show:\n- The 85% failure rate within year one\n- The median profit of $200-500/month (for survivors)\n- The 'passive' income requiring 40+ hours/week of customer service, supplier management, and ad optimization",
            posiBotQuotes: [
                { position: "RIGHT", text: "Failure is just success in disguise!" },
                { position: "LEFT", text: "Statistics are for quitters!" }
            ],
            visuals: [
                { type: "CHART", description: "Bar chart comparing 'Guru Claims' ($10k/mo passive) vs 'Reality' ($200/mo median active work)", caption: "Promise vs Reality" },
                { type: "HERO", description: "Split image: Left shows yacht/laptop lifestyle, Right shows person stressed at 2am handling customer complaints", caption: "Expectation vs Reality" }
            ]
        },
        {
            number: 2,
            title: "THE ROADMAP: The Free Playbook They Sell for $997",
            content: "## The 'Secret' 10-Step Method\n\nHere it is—the exact playbook gurus charge $997 for:\n\n1. **Set up Shopify** ($29/mo minimum)\n2. **Install Oberlo/DSers** (free-$30/mo)\n3. **Find products on AliExpress** (sort by orders)\n4. **Import to store** (one click)\n5. **Write product descriptions** (copy from competitors)\n6. **Set prices** (2.5-3x supplier cost)\n7. **Create Facebook Business account**\n8. **Run traffic ads** ($5-20/day to start)\n9. **Test 10-20 products**\n10. **Scale winners, kill losers**\n\nThat's it. That's the whole 'system.' Everything else is optimization.\n\n**Why it fails:** Everyone has this playbook. You're competing against thousands of stores with identical products, suppliers, and margins.",
            posiBotQuotes: [
                { position: "LEFT", text: "Knowledge is power!" },
                { position: "RIGHT", text: "Anyone can do it—including your 50,000 competitors!" },
                { position: "LEFT", text: "First mover advantage still exists...somewhere!" }
            ],
            visuals: [
                { type: "DIAGRAM", description: "Flowchart showing the 10 steps as a circular cycle with 'LOSE MONEY' as the center hub", caption: "The Hamster Wheel" }
            ]
        },
        {
            number: 3,
            title: "THE MATH: The $50 Startup That Costs $5,000",
            content: "## Official vs Actual Costs\n\n**What Gurus Say:**\n- Shopify: $29\n- Domain: $12\n- Total: $41 to start!\n\n**What It Actually Costs (First 3 Months):**\n\n| Item | Monthly | 3-Month Total |\n|------|---------|---------------|\n| Shopify Basic | $29 | $87 |\n| Theme | $180 | $180 |\n| Essential Apps | $50-100 | $150-300 |\n| Product Samples | - | $200-500 |\n| Ad Testing Budget | $500-1000 | $1,500-3,000 |\n| LLC/Business Setup | - | $200-500 |\n| **TOTAL** | | **$2,317-4,567** |\n\nAnd that's assuming you don't waste money on courses, which most beginners do ($500-$2000 more).",
            posiBotQuotes: [
                { position: "RIGHT", text: "Math is just a mindset!" },
                { position: "LEFT", text: "Debt is future investment!" }
            ],
            visuals: [
                { type: "CHART", description: "Waterfall chart showing cost escalation from $41 'advertised' to $4,500 real first-quarter cost", caption: "The True Cost Waterfall" }
            ]
        },
        {
            number: 4,
            title: "CASE STUDIES: Smart People Who Lost Everything",
            content: "## The Side Hustler\n\n**Mike T., 30, Software Engineer**\n\nMike had a good job but wanted 'freedom.' He took a $997 course, spent 4 months building his store, and invested $4,200 in Facebook ads.\n\nResult: $800 in sales. -$3,400 net loss. His 'winning product' was being sold by 200+ other stores.\n\n---\n\n## The Desperate Escapee\n\n**Sarah K., 35, Stay-at-home Mom**\n\nSarah saved $2,000 from her household budget to 'build something for herself.' Within 6 weeks:\n- Store suspended for policy violation (copied product descriptions)\n- Supplier stopped responding\n- 12 customers demanding refunds she couldn't process\n\nResult: -$2,000, damaged credit from chargebacks.\n\n---\n\n## The Rare Winner\n\n**James L., 42, Former Amazon Seller**\n\nJames succeeded—but look at what it took:\n- $50,000 starting capital\n- 18 months of iteration\n- Switched to US suppliers (higher cost, faster shipping)\n- Built an actual brand, not a generic store\n- Works 50+ hours/week managing it\n\nResult: $15,000/mo profit after nearly 2 years.",
            visuals: [
                { type: "PORTRAIT", description: "Silhouette of person at computer with 'ACCOUNT SUSPENDED' notification", caption: "The most common ending" }
            ]
        },
        {
            number: 5,
            title: "HIDDEN KILLERS: Why the Game is Already Over",
            content: "## The 5 Structural Problems\n\n### 1. Margin Compression\nWhen you and 1,000 competitors sell the same $10 product, price wars push margins to zero.\n\n### 2. CAC Inflation\nFacebook/TikTok ads cost more every year. Customer acquisition that cost $5 in 2019 costs $15-25 in 2024.\n\n### 3. Platform Risk\n- Facebook bans accounts without warning\n- Shopify closes stores for 'suspected fraud'\n- PayPal freezes funds for 180 days\n\n### 4. Supplier Dependency\nYour business depends on someone in Shenzhen you've never met. They can:\n- Raise prices without notice\n- Send defective products\n- Simply disappear\n\n### 5. Zero Moat\nUnlike real businesses, you own nothing:\n- No patents, no brand equity\n- No customer list (platform-owned)\n- No supplier relationships\n- Any success is immediately copied",
            posiBotQuotes: [
                { position: "RIGHT", text: "Obstacles are just opportunities in disguise!" },
                { position: "LEFT", text: "If it was easy, everyone would do it! Oh wait..." }
            ],
            visuals: [
                { type: "DIAGRAM", description: "Five guillotine blades labeled with each hidden killer, positioned above a cartoon dropshipper", caption: "The Five Ways to Die" }
            ]
        },
        {
            number: 6,
            title: "DECISION FRAMEWORK: Should You Even Try?",
            content: "## The Brutal Honest Checklist\n\nScore yourself (1-5 for each):\n\n- [ ] **Capital**: Do you have $5,000+ you can afford to lose completely?\n- [ ] **Time**: Can you commit 20+ hours/week for 6-12 months?\n- [ ] **Skills**: Do you have experience in marketing, copywriting, or e-commerce?\n- [ ] **Risk Tolerance**: Can you handle 3-6 months of zero or negative returns?\n- [ ] **Support System**: Do you have income/savings to cover living expenses?\n\n**Scoring:**\n- 20-25: Maybe worth attempting with eyes wide open\n- 15-19: High risk of failure and financial stress\n- Below 15: This is not for you right now\n\n**For 90-95% of people reading this: Don't do it.** The math doesn't support it, the competition is too fierce, and the opportunity cost is too high.",
            posiBotQuotes: [
                { position: "LEFT", text: "Believe in yourself! That's worth at least 20 points!" }
            ],
            visuals: [
                { type: "CHART", description: "Pie chart showing 90% 'Should Not Try' vs 10% 'Might Work With Caveats'", caption: "The Honest Assessment" }
            ]
        },
        {
            number: 7,
            title: "ALTERNATIVES: What Smart People Actually Do",
            content: "## Better Uses of Your Time and Money\n\n### 1. Freelancing in Your Existing Skills\n- Use platforms like Upwork, Fiverr, Toptal\n- You already have the skills\n- Get paid first, then deliver\n- Build real client relationships\n\n### 2. The Hybrid Model\n- Keep your job\n- Build skills on the side\n- Only quit when side income = salary for 6+ months\n\n### 3. Index Fund Investing\n- Take that $5,000 dropshipping budget\n- Put in S&P 500 index fund\n- Historical return: 10% annually\n- In 10 years: ~$13,000 (vs likely $0 from dropshipping)\n\n### 4. Industry Job in E-commerce\n- Get paid to learn from established companies\n- Build network and expertise\n- No personal financial risk\n- Then maybe start something after 2-3 years",
            posiBotQuotes: [
                { position: "RIGHT", text: "Playing it safe never made anyone rich! (Statistically false)" }
            ],
            visuals: [
                { type: "CHART", description: "Comparison bar showing expected value of each path over 5 years", caption: "Expected Value Analysis" }
            ]
        },
        {
            number: 8,
            title: "IF YOU'RE STILL HERE: The 5%'s Playbook",
            content: "## For the Stubborn Few\n\nIf you've read everything and you're still determined, here are the guardrails:\n\n### The Honesty Contract\nSign this mentally:\n- I understand I will likely lose money\n- I have a hard stop-loss amount: $______\n- I will not go into debt for this\n- I will not quit my job until profitable for 6+ months\n- I will treat this as paid education, not passive income\n\n### The 7 Guardrails\n1. **Set a kill switch**: Max loss of $X before you quit\n2. **Keep your job**: This is a side project only\n3. **Test before invest**: Validate demand before spending on ads\n4. **Track everything**: Know your ROAS, CAC, LTV to the penny\n5. **Build a brand**: Generic stores die; brands survive\n6. **US suppliers**: Pay more, ship faster, fewer refunds\n7. **Have an exit plan**: Define 'success' and 'failure' beforehand\n\n**Final Truth**: The 5% who succeed treat this as a real business requiring capital, expertise, and full commitment—not a laptop lifestyle shortcut.",
            posiBotQuotes: [
                { position: "LEFT", text: "You got this! Statistically, you don't, but emotionally, you do!" },
                { position: "RIGHT", text: "The journey of a thousand losses begins with a single ad!" }
            ],
            visuals: [
                { type: "CALLOUT", description: "Contract-style document with 'THE HONESTY CONTRACT' header and signature line", caption: "Sign Before Proceeding" }
            ]
        }
    ]
};
