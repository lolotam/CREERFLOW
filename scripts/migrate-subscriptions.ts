#!/usr/bin/env tsx

/**
 * Migration script to import existing JSON subscriptions into the SQLite database
 * This ensures that existing subscriptions appear in the admin dashboard
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { createEmailSubscriber, getDatabase } from '../lib/database';

interface JsonSubscription {
  id: string;
  email: string;
  subscribedAt: string;
  userAgent?: string;
  ipAddress?: string;
}

const SUBSCRIPTIONS_FILE_PATH = path.join(process.cwd(), 'data', 'subscriptions.json');

async function migrateSubscriptions() {
  console.log('🔄 Starting subscription migration...');

  // Check if JSON file exists
  if (!existsSync(SUBSCRIPTIONS_FILE_PATH)) {
    console.log('❌ No subscriptions.json file found. Nothing to migrate.');
    return;
  }

  try {
    // Read existing JSON subscriptions
    const jsonData = await readFile(SUBSCRIPTIONS_FILE_PATH, 'utf-8');
    const subscriptions: JsonSubscription[] = JSON.parse(jsonData);

    console.log(`📊 Found ${subscriptions.length} subscriptions in JSON file`);

    if (subscriptions.length === 0) {
      console.log('✅ No subscriptions to migrate.');
      return;
    }

    // Initialize database
    const db = await getDatabase();
    if (!db) {
      console.error('❌ Failed to initialize database');
      return;
    }

    let migrated = 0;
    let skipped = 0;

    // Migrate each subscription
    for (const subscription of subscriptions) {
      try {
        // Check if email already exists in database
        const existing = await db.get('SELECT id FROM email_subscribers WHERE email = ?', subscription.email);

        if (existing) {
          console.log(`⏭️  Skipping ${subscription.email} - already exists in database`);
          skipped++;
          continue;
        }

        // Create subscriber in database
        const result = await createEmailSubscriber(subscription.email);

        if (result) {
          // Update the subscription date to match the original
          await db.run(`
            UPDATE email_subscribers
            SET subscription_date = ?, created_at = ?
            WHERE id = ?
          `, subscription.subscribedAt, subscription.subscribedAt, result.id);

          console.log(`✅ Migrated: ${subscription.email} (${subscription.subscribedAt})`);
          migrated++;
        } else {
          console.log(`❌ Failed to migrate: ${subscription.email}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating ${subscription.email}:`, error);
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migrated} subscriptions`);
    console.log(`⏭️  Skipped (already exists): ${skipped} subscriptions`);
    console.log(`📊 Total processed: ${migrated + skipped} subscriptions`);

    if (migrated > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('💡 Existing subscriptions should now appear in the admin dashboard.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateSubscriptions()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateSubscriptions };
