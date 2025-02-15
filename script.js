const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const resultText = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");

const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

// Mapping of currency code to country code for flag
const countryList = {
    AED: "AE",
    AFN: "AF",
    XCD: "AG",
    ALL: "AL",
    AMD: "AM",
    ANG: "AN",
    AOA: "AO",
    AQD: "AQ",
    ARS: "AR",
    AUD: "AU",
    AZN: "AZ",
    BAM: "BA",
    BBD: "BB",
    BDT: "BD",
    XOF: "BE",
    BGN: "BG",
    BHD: "BH",
    BIF: "BI",
    BMD: "BM",
    BND: "BN",
    BOB: "BO",
    BRL: "BR",
    BSD: "BS",
    NOK: "BV",
    BWP: "BW",
    BYR: "BY",
    BZD: "BZ",
    CAD: "CA",
    CDF: "CD",
    XAF: "CF",
    CHF: "CH",
    CLP: "CL",
    CNY: "CN",
    COP: "CO",
    CRC: "CR",
    CUP: "CU",
    CVE: "CV",
    CYP: "CY",
    CZK: "CZ",
    DJF: "DJ",
    DKK: "DK",
    DOP: "DO",
    DZD: "DZ",
    ECS: "EC",
    EEK: "EE",
    EGP: "EG",
    ETB: "ET",
    EUR: "FR",
    FJD: "FJ",
    FKP: "FK",
    GBP: "GB",
    GEL: "GE",
    GGP: "GG",
    GHS: "GH",
    GIP: "GI",
    GMD: "GM",
    GNF: "GN",
    GTQ: "GT",
    GYD: "GY",
    HKD: "HK",
    HNL: "HN",
    HRK: "HR",
    HTG: "HT",
    HUF: "HU",
    IDR: "ID",
    ILS: "IL",
    INR: "IN",
    IQD: "IQ",
    IRR: "IR",
    ISK: "IS",
    JMD: "JM",
    JOD: "JO",
    JPY: "JP",
    KES: "KE",
    KGS: "KG",
    KHR: "KH",
    KMF: "KM",
    KPW: "KP",
    KRW: "KR",
    KWD: "KW",
    KYD: "KY",
    KZT: "KZ",
    LAK: "LA",
    LBP: "LB",
    LKR: "LK",
    LRD: "LR",
    LSL: "LS",
    LTL: "LT",
    LVL: "LV",
    LYD: "LY",
    MAD: "MA",
    MDL: "MD",
    MGA: "MG",
    MKD: "MK",
    MMK: "MM",
    MNT: "MN",
    MOP: "MO",
    MRO: "MR",
    MTL: "MT",
    MUR: "MU",
    MVR: "MV",
    MWK: "MW",
    MXN: "MX",
    MYR: "MY",
    MZN: "MZ",
    NAD: "NA",
    XPF: "NC",
    NGN: "NG",
    NIO: "NI",
    NPR: "NP",
    NZD: "NZ",
    OMR: "OM",
    PAB: "PA",
    PEN: "PE",
    PGK: "PG",
    PHP: "PH",
    PKR: "PK",
    PLN: "PL",
    PYG: "PY",
    QAR: "QA",
    RON: "RO",
    RSD: "RS",
    RUB: "RU",
    RWF: "RW",
    SAR: "SA",
    SBD: "SB",
    SCR: "SC",
    SDG: "SD",
    SEK: "SE",
    SGD: "SG",
    SKK: "SK",
    SLL: "SL",
    SOS: "SO",
    SRD: "SR",
    STD: "ST",
    SVC: "SV",
    SYP: "SY",
    SZL: "SZ",
    THB: "TH",
    TJS: "TJ",
    TMT: "TM",
    TND: "TN",
    TOP: "TO",
    TRY: "TR",
    TTD: "TT",
    TWD: "TW",
    TZS: "TZ",
    UAH: "UA",
    UGX: "UG",
    USD: "US",
    UYU: "UY",
    UZS: "UZ",
    VEF: "VE",
    VND: "VN",
    VUV: "VU",
    YER: "YE",
    ZAR: "ZA",
    ZMK: "ZM",
    ZWD: "ZW",
  };

// Function to load currencies with flags
async function loadCurrencies() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();

        const currencyList = {};
        countries.forEach((country) => {
            if (country.currencies) {
                const currencyCode = Object.keys(country.currencies)[0];
                if (!currencyList[currencyCode]) {
                    currencyList[currencyCode] = country.flags.png;
                }
            }
        });

        Object.entries(currencyList).forEach(([currencyCode, flag]) => {
            const optionFrom = document.createElement("option");
            optionFrom.value = currencyCode;
            optionFrom.innerHTML = `${currencyCode}`;
            fromCurrency.appendChild(optionFrom);

            const optionTo = document.createElement("option");
            optionTo.value = currencyCode;
            optionTo.innerHTML = `${currencyCode}`;
            toCurrency.appendChild(optionTo);
        });

        // Set default currencies
        fromCurrency.value = "USD";
        toCurrency.value = "BDT";
        updateFlag(fromCurrency);
        updateFlag(toCurrency);
    } catch (error) {
        console.error("Error loading currencies:", error);
    }
}

// Function to update exchange rate
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || amount <= 0) {
        resultText.textContent = "Please enter a valid amount.";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}${from}`);
        const data = await response.json();

        if (!data.rates[to]) {
            resultText.textContent = "Conversion rate not available.";
            return;
        }

        const rate = data.rates[to];
        const convertedAmount = (amount * rate).toFixed(2);
        resultText.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
    } catch (error) {
        resultText.textContent = "Error fetching conversion rates. Please try again later.";
        console.error("Error:", error);
    }
}

// Function to update flag based on selected currency
function updateFlag(element) {
    let currencyCode = element.value;
    let countryCode = countryList[currencyCode];
    let flagUrl = `https://flagsapi.com/${countryCode}/flat/64.png`;

    if (element === fromCurrency) {
        fromFlag.src = flagUrl;
    } else if (element === toCurrency) {
        toFlag.src = flagUrl;
    }
}

// Event Listeners
convertBtn.addEventListener("click", (event) => {
    event.preventDefault();
    convertCurrency();
});

fromCurrency.addEventListener("change", () => updateFlag(fromCurrency));
toCurrency.addEventListener("change", () => updateFlag(toCurrency));

// Load currencies on page load
window.addEventListener("load", loadCurrencies);