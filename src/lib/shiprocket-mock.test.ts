import test from 'node:test';
import assert from 'node:assert';
import { shiprocketMock } from './shiprocket-mock';

test('Shiprocket Mock Workflow Integration', async (t) => {
  const mockOrder = { id: 'ORD_TEST_123', total: 5000 };

  await t.test('should create a shipment and return a shipment_id', async () => {
    const response = await shiprocketMock.createShipment(mockOrder);
    assert.strictEqual(response.success, true);
    assert.strictEqual(typeof response.shipment_id, 'number');
    assert.strictEqual(response.status, 'NEW');
  });

  await t.test('should generate a valid AWB code', async () => {
    const shipment = await shiprocketMock.createShipment(mockOrder);
    const awb = await shiprocketMock.generateAWB(shipment.shipment_id);
    assert.strictEqual(awb.success, true);
    assert.match(awb.awb_code, /^SR[A-Z0-9]+$/);
  });

  await t.test('should map Shiprocket statuses to UI phases correctly', () => {
    assert.strictEqual(shiprocketMock.getTrackingStatus('NEW'), 'PENDING');
    assert.strictEqual(shiprocketMock.getTrackingStatus('AWB ASSIGNED'), 'SHIPPED');
    assert.strictEqual(shiprocketMock.getTrackingStatus('DELIVERED'), 'DELIVERED');
    // Fallback check
    assert.strictEqual(shiprocketMock.getTrackingStatus('UNKNOWN_CODE'), 'PENDING');
  });
});