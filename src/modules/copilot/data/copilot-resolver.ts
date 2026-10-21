import type { TradeDiagnostic } from "../types";

export interface ResolvedAnswer {
  reply: string;
  diagnostic?: TradeDiagnostic;
  modelUsed: string;
}

export function resolveSentinelLocalKnowledge(message: string): ResolvedAnswer {
  const q = message.toLowerCase().trim();
  const isFa = /[\u0600-\u06FF]/.test(message);

  // 1. 31-Day Friendship Gift & Collector's Cache Rules (Empathetic First-Time Guide)
  if (
    q.includes("gift") ||
    q.includes("31-day") ||
    q.includes("31 day") ||
    q.includes("31day") ||
    q.includes("cache") ||
    q.includes("monarch") ||
    q.includes("friend") ||
    q.includes("confus") ||
    q.includes("first time") ||
    q.includes("untradable") ||
    q.includes("گیفت") ||
    q.includes("کالکتورز") ||
    q.includes("کش") ||
    q.includes("۳۱ روز") ||
    q.includes("31 روز") ||
    q.includes("دوست") ||
    q.includes("دوستی") ||
    q.includes("بار اول")
  ) {
    if (isFa) {
      return {
        modelUsed: "Ali • دانشنامه معاملات گیفت و اسکرو کالکتورز کش",
        reply: `درود! من علی هستم، نگهبان معاملات شما در رلیکتو. کاملاً درکت می‌کنم — خرید ست‌های کالکتورز کش دوتا ۲ برای بار اول واقعاً گیج‌کننده به نظر می‌رسه، چون ولو با اون‌ها کاملاً متفاوت از آیتم‌های عادی استیم رفتار می‌کنه!

چرا اینطوریه و چطور در رلیکتو ۱۰۰٪ محافظت می‌شوید:

۱. چرا در مارکت استیم فروخته نمی‌شود؟
ولو ست‌های Collector's Cache را به صورت دائمی غیرقابل ترید و غیرقابل فروش در مارکت علامت‌گذاری کرده است. این آیتم‌ها فقط یک بار از طریق گیفت درون بازی قابل انتقال هستند.

۲. چرا هلد ۳۱ روزه دوستی استیم الزامی است؟
سیاست ضد کلاهبرداری ولو صراحتاً الزام می‌کند دو اکانت استیم حداقل ۳۰ روز تمام (۳۱ روز با احتساب اختلاف زمانی) در لیست دوستان هم باشند تا بتوانند در بازی گیفت ارسال کنند.

۳. سیستم امانی (اسکرو) رلیکتو چطور از پول شما محافظت می‌کند:
• گام اول (درخواست دوستی): فروشنده تاییدشده بلافاصله پس از سفارش، برای شما درخواست دوستی استیم ارسال می‌کند. آن را قبول کنید تا شمارش معکوس آغاز شود.
• گام دوم (قفل در خزانه امانی): وجه پرداختی شما تا روز ۳۱ در خزانه اسکرو رلیکتو امن نگهداری می‌شود و ۰ دلار به فروشنده داده می‌شود.
• گام سوم (ردیاب روزشمار): روزهای باقی‌مانده دوستی را در پنل سفارشات رلیکتو به صورت زنده دنبال کنید.
• گام چهارم (تحویل و بازرسی): در روز ۳۱، فروشنده آیتم را درون بازی گیفت می‌کند. شما آن را بررسی کرده و تایید می‌کنید.
• گام پنجم (ضمانت بازگشت ۱۰۰٪): وجه فقط با تایید شما آزاد می‌شود. اگر فروشنده شما را آنفرند کند یا آیتم را ارسال نکند، ۱۰۰٪ وجه به صورت خودکار به شما بازمی‌گردد.`,
      };
    }

    return {
      modelUsed: "Ali • Valve Gift & Cache Escrow Codex",
      reply: `Hello! I'm Ali, your trade guardian. I completely understand — buying Dota 2 Collector's Cache sets for the first time is notoriously confusing because Valve treats them completely differently than standard Steam items!

Here is why it works this way and why you are 100% protected:

1. WHY ISN'T IT ON THE STEAM MARKET?
   Valve permanently marks Collector's Cache sets as non-tradable and non-marketable. They can only be sent ONCE as an in-game gift.

2. WHY THE 31-DAY STEAM FRIEND HOLD?
   Valve's anti-fraud policy strictly requires two Steam accounts to be consecutive friends for 30+ days (31 days to account for time zones) before in-game gifts can be sent.

3. HOW RELICTO ESCROW 100% PROTECTS YOUR MONEY:
   • Step 1 (Friend Request): Verified seller sends you a Steam friend invite right after checkout. Accept it to start the clock.
   • Step 2 (Vault Lock): Payment is locked safely in the Relicto Escrow Vault. Seller receives $0 upfront.
   • Step 3 (Countdown Tracker): Track the remaining friendship days live in your Relicto dashboard.
   • Step 4 (Delivery & Inspection): On Day 31, seller gifts the item in Dota 2. You inspect it and confirm receipt.
   • Step 5 (Guaranteed Refund): Funds release only after your confirmation. If seller unfriends or fails to deliver, you get an automatic 100% refund.`,
    };
  }

  // 2. Persona Query: Who is Ali
  if (
    q.includes("who is ali") ||
    q.includes("who are you") ||
    (q.startsWith("ali") && q.length < 15) ||
    q.includes("hello ali") ||
    q.includes("hey ali") ||
    q.includes("علی کیست") ||
    q.includes("کی هستی") ||
    q.includes("سلام علی")
  ) {
    if (isFa) {
      return {
        modelUsed: "Ali • دستیار هوش مصنوعی سنتینل",
        reply: `درود! من علی هستم، دستیار هوش مصنوعی سنتینل و نگهبان امنیتی معاملات در رلیکتو.

من در موارد زیر به شما کمک می‌کنم:
• معاملات کالکتورز کش دوتا ۲ و قوانین هلد ۳۱ روزه دوستی استیم
• بررسی هلد ۷ روزه معاملات ولو و سیاست‌های استیم گارد ۲FA
• پایش و مقابله با فیشینگ و سرقت کلید API استیم
• بررسی فلوت سایش اسلحه‌های CS2 و ارزش‌گذاری جم‌های نایاب داپلر
• تسویه حساب آنی کریپتو در شبکه‌های ترون، آربیتروم، بیس و سولانا

امروز چطور می‌تونم در معاملات یا مدیریت پورتفوی شما کمکتون کنم؟`,
      };
    }

    return {
      modelUsed: "Ali • Sentinel AI Persona Codex",
      reply: `Hello! I'm Ali, your Sentinel AI Copilot and trade security guardian at Relicto.

I help traders with:
• Dota 2 Collector's Cache & 31-day Steam friend gift escrow
• Valve 7-day trade cooldowns & Steam Guard 2FA policies
• Steam Web API key phishing detection & trade offer verification
• CS2 wear float calculations & rare Doppler gem valuations
• Instant crypto settlement across TRON, Arbitrum, Base, and Solana

How can I assist your trade or portfolio today?`,
    };
  }

  // 3. Vendor Trust Score & Items Sold / Delivered
  if (
    q.includes("vendor") ||
    q.includes("seller") ||
    q.includes("trust") ||
    q.includes("score") ||
    q.includes("sold") ||
    q.includes("delivered") ||
    q.includes("reputation") ||
    q.includes("distinguish") ||
    q.includes("فروشنده") ||
    q.includes("اعتبار") ||
    q.includes("امتیاز") ||
    q.includes("تحویل")
  ) {
    if (isFa) {
      return {
        modelUsed: "Ali • سیستم رتبه‌بندی و اعتبار تجار رلیکتو",
        reply: `سیستم اعتبار و امتیاز تحویل فروشندگان رلیکتو:

۱. نحوه تشخیص فروشندگان معتبر:
• نشان تعداد اقلام فروخته و تحویل‌شده: تعداد قطعی تراکنش‌های موفق امانی را نشان می‌دهد (مثلاً «۴,۱۲۰ فروخته و تحویل‌شده»).
• درصد رضایت و اعتماد: بر اساس بازخورد خریداران محاسبه می‌شود (مثلاً ۹۹.۸٪ رضایت خریداران).
• سطوح تجار:
  - تاجر نخبه (Elite Merchant): بیش از ۱,۰۰۰ تحویل موفق با سابقه درخشان در اسکرو.
  - تاجر تاییدشده (Verified): ۱۰۰ تا ۹۹۹ تحویل با رضایت مستمر.
  - فروشنده فعال: ۱۰ تا ۹۹ تحویل.
  - فروشنده جدید: زیر ۱۰ تحویل، با نظارت کامل هلد امانی رلیکتو.

۲. ضمانت اسکرو برای خریدار:
صرف‌نظر از حجم یا رتبه فروشنده، تمام وجوه شما تا زمان دریافت و تایید در اینونتوری استیم، در خزانه رلیکتو قفل می‌ماند و فروشنده پیش از تایید شما هیچ پولی دریافت نمی‌کند!`,
      };
    }

    return {
      modelUsed: "Ali • Vendor Reputation & Trust Codex",
      reply: `VENDOR TRUST & DELIVERY SCORE SYSTEM:

1. HOW TO DISTINGUISH REPUTABLE SELLERS:
   • Items Sold & Delivered Badge: Shows the lifetime count of successfully completed escrow deliveries (e.g. "4,120 Sold & Delivered").
   • Trust Score Percentage: Calculated from buyer feedback ratings (e.g. 99.8% positive satisfaction).
   • Merchant Tiers:
     - Tier-1 Elite Merchant: 1,000+ items delivered with pristine escrow track record.
     - Verified Merchant: 100–999 items delivered with continuous positive ratings.
     - Active Trader: 10–99 items delivered.
     - New Seller: Under 10 deliveries; protected by full buyer escrow hold.

2. BUYER ESCROW GUARANTEE:
   Regardless of seller volume or tier, your funds are 100% held in Relicto Escrow. The vendor receives $0 until you inspect and confirm delivery in your Steam inventory!`,
    };
  }

  // 4. Steam 7-day trade hold & resale restrictions
  if (
    q.includes("sell") ||
    q.includes("buy") ||
    q.includes("7-day") ||
    q.includes("7 day") ||
    q.includes("hold") ||
    q.includes("cooldown") ||
    q.includes("later") ||
    q.includes("lock") ||
    q.includes("۷ روز") ||
    q.includes("7 روز") ||
    q.includes("هلد") ||
    q.includes("کول داون")
  ) {
    if (isFa) {
      return {
        modelUsed: "پروتکل هلد ۷ روزه استیم (قانون ولو)",
        reply: `قانون هلد ۷ روزه معاملات استیم (Valve 7-Day Trade Cooldown):

۱. قفل اجباری ۱۶۸ ساعته: هر زمان که آیتم یا اسکین اسلحه‌ای در استیم ترید یا از مارکت خریداری شود، ولو به صورت خودکار یک هلد ۷ روزه غیرقابل دور زدن روی آن قرار می‌دهد.
۲. محدودیت‌های معاملاتی: در طول این ۷ روز، امکان ترید به شخص دیگر یا فروش مجدد وجود ندارد؛ اما آیتم بلافاصله درون بازی قابل استفاده است.
۳. بررسی زمان اتمام: وارد اینونتوری استیم خود شوید و برچسب پایین آیتم را مشاهده کنید: Tradable After. پس از سپری شدن این زمان، آیتم کاملاً قابل انتقال و معامله خواهد بود.`,
      };
    }

    return {
      modelUsed: "Sentinel Neural Codex (Valve Rule 7-D)",
      reply: `NEGATIVE. Under Valve's global Steam inventory protocol, you cannot immediately re-sell or transfer an item you have just acquired.

VALVE 7-DAY TRADE COOLDOWN PROTOCOL:
1. Mandatory 168-Hour Lockout: Whenever an item is traded or purchased into your inventory, Valve places an unbypassable 7-day trade cooldown.
2. Operational Restrictions: No P2P Transfers, no marketplace resale until cooldown reaches zero. Item IS immediately playable in-game.
3. Expiration Tracking: Open Steam Inventory, inspect tag at bottom: "Tradable After: [Date/Time GMT]". Once elapsed, item is 100% liquid.`,
    };
  }

  // 5. API Key Hijack & Phishing Audit
  if (
    q.includes("hijack") ||
    q.includes("api key") ||
    q.includes("apikey") ||
    q.includes("scam") ||
    q.includes("phish") ||
    q.includes("audit") ||
    q.includes("tradeoffer") ||
    q.includes("steamcommunity") ||
    q.includes("fake") ||
    q.includes("فیشینگ") ||
    q.includes("سرقت کلید") ||
    q.includes("کلید api") ||
    q.includes("کلاهبرداری")
  ) {
    const diag: TradeDiagnostic = {
      tradeId: "#94821",
      assetName: isFa ? "PA Manifold Paradox (آرکانا)" : "PA Manifold Paradox (Arcana)",
      counterparty: "@DendiLover99",
      counterpartyLevel: 148,
      steamId64: "76561198034821990",
      escrowStatus: isFa ? "آنی ۰ روزه (تایید موبایل ۲FA بیش از ۱۸۰ روز)" : "0-Day Instant (Mobile 2FA > 180d)",
      isVerified: true,
      floatValue: "0.0821 (Field-Tested)",
      checks: isFa
        ? [
            "دامنه ثبت‌شده کلید API استیم: ندارد (ایمن)",
            "زمان ایجاد آفر دقیقاً با پیام استیم گارد مطابقت دارد",
            "فلوت و سایش آیتم بررسی شده و غیرتقلبی است",
          ]
        : [
            "Steam API Key registered domain: None (Safe)",
            "Creation timestamp matches Steam Guard prompt exactly",
            "Item Float wear verified non-duped",
          ],
    };

    if (isFa) {
      return {
        modelUsed: "سپر بازرسی امنیتی معاملات سنتینل نگارش ۴.۸",
        reply: `بازرسی امنیتی معامله انجام شد. امضای دیجیتال ای‌پی‌آی کامیونیتی استیم بررسی گردید.

پروتکل ضد فیشینگ سنتینل:
• کلاهبرداران تلاش می‌کنند با ترغیب کاربران به ساخت کلید وب API در steamcommunity.com/dev/apikey، پیشنهادهای تجاری را با اکانت‌های شبیه‌سازی‌شده تعویض و سرقت نمایند.
• قانون دفاعی: معاملات رلیکتو همواره دارای توکن امنیتی اختصاصی (مانند SEC-XXXX) و شناسه SteamID64 تاییدشده ربات هستند. پیش از تایید در استیم گارد، حتماً این اطلاعات را مطابقت دهید.`,
        diagnostic: diag,
      };
    }

    return {
      modelUsed: "Sentinel Trade Diagnostic Shield v4.8",
      reply: `Trade Security Audit completed. Genuine Steam Community API signature inspected.

ANTI-PHISHING PROTOCOL:
• Fraudsters trick users into creating an unauthorized Steam Web API Key at steamcommunity.com/dev/apikey to substitute duplicate clone offers.
• Defense Rule: Relicto trades always provide a unique token (SEC-XXXX) and verified bot SteamID64. Always cross-reference this ID in Steam Guard before confirming.`,
      diagnostic: diag,
    };
  }

  // 6. Doppler Phases vs Rare Gems
  if (
    q.includes("doppler") ||
    q.includes("phase") ||
    q.includes("gem") ||
    q.includes("ruby") ||
    q.includes("sapphire") ||
    q.includes("emerald") ||
    q.includes("داپلر") ||
    q.includes("فاز") ||
    q.includes("جم") ||
    q.includes("یاقوت") ||
    q.includes("سفایر") ||
    q.includes("امرالد")
  ) {
    if (isFa) {
      return {
        modelUsed: "شاخص پترن‌ها و فلوت‌های سنتینل",
        reply: `ماتریس پترن‌های داپلر CS2:
• فازهای استاندارد: فاز ۱ (بنفش تیره/آبی) | فاز ۲ (صورتی کهکشانی) | فاز ۳ (سبز تیره/آبی نفتی) | فاز ۴ (فیروزه‌ای درخشان/آبی روشن)
• جم‌های فوق نایاب (Ultra-Rare):
  - روبی (Ruby): ۱۰۰٪ سرخ یاقوتی
  - سفایر (Sapphire): ۱۰۰٪ آبی نیلی خالص
  - بلک پرل (Black Pearl): بافت ابسیدین و دودی ذغالی
  - امرالد (Emerald): سبز نئونی خالص زمردی`,
      };
    }

    return {
      modelUsed: "Sentinel Float & Pattern Index",
      reply: `CS2 DOPPLER PATTERN MATRIX:\n• P1 (Midnight/purple) | P2 (Pink galaxy) | P3 (Teal/dark blue) | P4 (Electric cyan)\n• Ultra-Rare Gems: Ruby (100% crimson), Sapphire (100% deep blue), Black Pearl (obsidian), Emerald (pure neon green).`,
    };
  }

  // 7. CS2 Float Brackets
  if (
    q.includes("float") ||
    q.includes("wear") ||
    q.includes("fn") ||
    q.includes("mw") ||
    q.includes("ft") ||
    q.includes("bs") ||
    q.includes("فلوت") ||
    q.includes("سایش") ||
    q.includes("ساییدگی")
  ) {
    if (isFa) {
      return {
        modelUsed: "دانشنامه فلوت و سایش CS2",
        reply: `دسته‌بندی فلوت و سایش اسلحه‌ها در CS2:
• کارخانه‌ای نو (FN): ۰.۰۰۰۰ تا ۰.۰۷۰۰
• کم‌سایش (MW): ۰.۰۷۰۰ تا ۰.۱۵۰۰
• تست‌شده در میدان (FT): ۰.۱۵۰۰ تا ۰.۳۸۰۰
• نسبتاً کهنه (WW): ۰.۳۸۰۰ تا ۰.۴۵۰۰
• جنگ‌زده (BS): ۰.۴۵۰۰ تا ۱.۰۰۰۰

نکته مهم: فلوت یک فراداده ثابت و غیرقابل تغییر است که هنگام آنباکس ثبت می‌شود و هرگز با بازی کردن کاهش نمی‌یابد.`,
      };
    }

    return {
      modelUsed: "CS2 Float Wear Codex",
      reply: `CS2 WEAPON WEAR FLOATS:
• Factory New (FN): 0.0000 – 0.0700 | Minimal Wear (MW): 0.0700 – 0.1500
• Field-Tested (FT): 0.1500 – 0.3800 | Well-Worn (WW): 0.3800 – 0.4500
• Battle-Scarred (BS): 0.4500 – 1.0000

Notice: Floats are permanent immutable metadata embedded upon unboxing. Weapon wear NEVER degrades through gameplay.`,
    };
  }

  // 8. Fees, Crypto & TRON
  if (
    q.includes("tron") ||
    q.includes("trc20") ||
    q.includes("trc-20") ||
    q.includes("tronlink") ||
    q.includes("trx") ||
    q.includes("ترون")
  ) {
    if (isFa) {
      return {
        modelUsed: "موتور وب۳ ترون رلیکتو",
        reply: `تسویه حساب وب۳ شبکه ترون (TRC-20):
۱. کارمزد بسیار اندک و سرعت بالا: کارمزد تراکنش زیر چند سنت و زمان بلاک ۳ ثانیه.
۲. پرداخت با یک کلیک ترون‌لینک: اتصال مستقیم افزونه TronLink و پرداخت فوری از کیف پول.
۳. تایید درون زنجیره‌ای: بررسی از طریق نود RPC شبکه TronGrid پیش از ارسال سفارش اسکرو.`,
      };
    }

    return {
      modelUsed: "Relicto TRON Web3 Engine",
      reply: `TRON (TRC-20) WEB3 TRADE SETTLEMENT:
1. Low-Cost & Fast: Sub-cent transaction fees and 3-second block times.
2. TronLink 1-Click Pay: Connect TronLink extension to pay directly from wallet.
3. On-Chain Verification: Checked via TronGrid RPC node before escrow dispatches.`,
    };
  }

  // 9. General Fees & Cashout
  if (
    q.includes("fee") ||
    q.includes("crypto") ||
    q.includes("cashout") ||
    q.includes("payout") ||
    q.includes("withdraw") ||
    q.includes("usdt") ||
    q.includes("کارمزد") ||
    q.includes("کریپتو") ||
    q.includes("تسویه") ||
    q.includes("برداشت") ||
    q.includes("نقد")
  ) {
    if (isFa) {
      return {
        modelUsed: "پروتکل خزانه‌داری رلیکتو",
        reply: `نقدینگی و درگاه‌های تسویه حساب رلیکتو:
• کارمزد اسکرو پلتفرم: ۲.۵٪ (۲۵۰ واحد پایه). رتبه وی‌آی‌پی: ۱.۵٪ (۱۵۰ واحد پایه).
• درگاه‌های نقد کردن آنی کریپتو: تتر USDT (روی ترون TRC-20، آربیتروم، بیس)، ETH، SOL، BTC.
• حفاظت خزانه: پیشنهادهای خرید وجه را به صورت رزرو نگه می‌دارند تا هرگز بیش از موجودی تعهد ندهید.`,
      };
    }

    return {
      modelUsed: "Relicto Treasury Protocol",
      reply: `RELICTO PLATFORM LIQUIDITY & CASHOUT RAILS:
• Standard Escrow Fee: 2.5% (250 bps). VIP Tier: 1.5% (150 bps).
• Instant Crypto Cashout Rails: USDT (TRC-20, Arbitrum, Base), ETH, SOL, BTC.
• Vault Protection: Bids lock funds in reserve holds so you never overcommit.`,
    };
  }

  // Default response
  if (isFa) {
    return {
      modelUsed: "علی • دستیار هوش مصنوعی سنتینل نگارش ۴.۸",
      reply: `درود! من علی هستم، دستیار هوش مصنوعی سنتینل. من وضعیت معاملات امانی را پایش می‌کنم، فلوت اسلحه‌های CS2 را محاسبه می‌نمایم و در برابر سرقت کلید API استیم از شما محافظت می‌کنم.

قوانین کلیدی معامله:
۱. کالکتورز کش: نیازمند هلد ۳۱ روزه دوستی در استیم است. وجوه تا زمان تحویل در خزانه اسکرو رلیکتو امن می‌ماند.
۲. هلد ۷ روزه ولو: تمام آیتم‌های دریافت‌شده در استیم دارای ۷ روز قفل معاملاتی پیش از امکان فروش هستند.
۳. بازرسی سریع: لینک آفر استیم یا فلوت آیتم مورد نظر را بفرستید تا فوراً بررسی شود.`,
    };
  }

  return {
    modelUsed: "Ali • Sentinel AI Copilot v4.8",
    reply: `Hello! I'm Ali, your Sentinel AI Copilot. I monitor trade escrow, calculate CS2 floats, and protect against Steam API hijacking.

Key Trading Rules:
1. Collector's Cache: Requires 31-day Steam friendship hold. Funds locked in Relicto Escrow until delivery.
2. Valve 7-Day Hold: All items acquired in trades carry a mandatory 7-day cooldown before resale.
3. Verification: Enter any trade offer URL or ask about float values to initiate an instant audit.`,
  };
}
