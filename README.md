# Up Transactions Sync

A simple background worker to copy my Up Transactions into a spreadsheet like tool.

I've gone with Airtable due their simple API for now. Longer term I want to move to syncing transactions to my own DB with basic consistency checks, and then forwarding data to Google Sheets to Microsoft Excel Online for analysis.

## Worker Overview

The worker is a [Cloudflare Worker](https://developers.cloudflare.com/workers/) with Cron trigger to perform the sync job.

