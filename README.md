# Up Transactions Sync

> A simple background worker to copy my Up Transactions into a spreadsheet like tool.

[Up](https://up.com.au/) is banking app that I use that provides a [developer API](https://developer.up.com.au/) to query transaction data. Which provides a great opportunity to easily get your transaction information out into a data analysis tool!

I've gone with Airtable as my data tool due their simple API for now. Longer term I want to move to syncing transactions to my own DB, and then forwarding the data to Google Sheets to Microsoft Excel Online for analysis.

## Solution Overview

The syncing worker is a [Cloudflare Worker](https://developers.cloudflare.com/workers/) with a Cron trigger to schedule the sync job at regular periods.

Up Transactions surface `HELD` or `SETTLED` states via the developer API. In the `HELD` state, the transaction can take an indeterminate amount of time to transition to the `SETTLED` state. In some cases, a `HELD` transaction may be deleted. To simplify things, only `SETTLED` transactions are currently synced.

This is fine for this project as I'm trying to analyse my transaction data over duration of weeks and months and can sacrifice the need for very up-to-date transaction data.

The syncing process queries the last 100 or so records from Up and Airtable, finds "unsynced" records and writes these records to Airtable. Airtable does not provide any idempotency checks (e.g. using Up TransactionId as an Idempotency Key), so we need to manually compare the sets of transactions before syncing into Airtable to avoid any duplicate records.

There is definitely a performance hit here in querying two data sources, comparing them and finally writing the unsynced records. However, given this worker is scheduled to run every hour, the total performance cost over time is small.

Syncing over the last 100 transactions, which roughly equates to 4 weeks of settled transactions, helps to catch any transactions that take a very long time to settle, and is tolerant against long lasting transient errors. For e.g. if the Airtable API is down for a day or two.

## Requirements

1. Node + NPM
2. Wrangler CLI and a Cloudflare Account

## Running the project

0. Use the Wrangler CLI to login to your Cloudflare Account `wrangler login`
1. `npm install`
2. `npm start`

Tests can be run using `npm test`.
