# Shopify-Google-Sheets-Data-Connector

1. Open Google Sheets
2. Go to extentions->Apps Script
3. Paste the Code of main.gs in the editor
4. Run it.
5. Go to the Spreadsheets.You will see 2 new Sheets created-> Data and Configurations.
6. Go to Conigurations sheet and paste your API_ACCESS_TOKEN of Shopify there.
7. Run the Code again.


Limitations:-
1. The code will not ensure new orders are reflected dynamically, hence either do manual re-run.
2. Or a script-re-run trigger of 1 minute is added, which ensures the script will re-run after every 1 minute.
