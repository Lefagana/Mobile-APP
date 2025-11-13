# Testing Guide - Wakanda-X Missing Features

This guide provides step-by-step instructions for testing all the newly implemented features.

## Prerequisites

1. **Start the development server:**
   ```bash
   npx expo start
   ```

2. **Open the app** on your device/emulator:
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

3. **Ensure you're logged in** (use phone: `+2348012345678`, OTP: `123456` in mock mode)

## 1. Testing In-App Notifications Screen (Phase 15)

### Access the Screen
1. Navigate to **Profile** tab (bottom navigation)
2. Tap on **Notifications** menu item
3. This opens the **Notification Settings** screen (different from NotificationList)
4. To test the **Notification List**, you need to add navigation or access it directly

### Add Navigation Link (Quick Fix)
Add a button in the Profile screen to navigate to NotificationList, or access it via:
- Debug screen (see section below)
- Or manually navigate using React Navigation

### Test NotificationList Features

#### A. View All Notifications
1. Open NotificationList screen
2. **Expected**: See list of 8 mock notifications
3. **Check**:
   - Notifications are sorted by newest first
   - Unread notifications have a colored left border
   - Each notification shows icon, title, message, and timestamp

#### B. Filter Notifications
1. Tap **"All"** tab - should show all notifications
2. Tap **"Unread"** tab - should show only unread notifications (3 unread)
3. **Expected**: Filter works correctly, badge shows count

#### C. Mark as Read
1. Tap on an unread notification
2. **Expected**:
   - Notification opens (or navigates if deep_link exists)
   - Notification is marked as read
   - Unread count decreases

#### D. Mark All as Read
1. If there are unread notifications, tap **"Mark all as read"** button in header
2. **Expected**:
   - All notifications become read
   - Unread count becomes 0
   - "Unread" tab shows empty state

#### E. Pull to Refresh
1. Pull down on the notification list
2. **Expected**: List refreshes and shows loading indicator

#### F. Deep Linking
1. Tap on a notification with a deep_link (e.g., "Order Confirmed")
2. **Expected**: Navigates to the linked screen (OrderDetail, ChatWindow, etc.)

#### G. Empty States
1. Switch to "Unread" tab when all are read
2. **Expected**: Shows "No Unread Notifications" empty state

### Test Notification Types
- **Order notifications**: Should show package icon, primary color
- **Delivery notifications**: Should show truck icon, primary color
- **Message notifications**: Should show message icon, green color
- **Promotion notifications**: Should show tag icon, orange color
- **Payment notifications**: Should show credit card icon, blue color
- **System notifications**: Should show info icon, secondary color

---

## 2. Testing Offline Queue Hook (Phase 16)

### Setup
1. The offline queue needs action handlers registered. Let's test it:

### Test Offline Queue Functionality

#### A. Register Action Handler
Add this to a test screen or the debug screen:

```typescript
import { registerActionHandler, useOfflineQueue } from '../hooks';

// Register a test handler
registerActionHandler('test-action', async (payload) => {
  console.log('Processing action:', payload);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
});
```

#### B. Test Queueing Actions
1. **Go offline** (turn off WiFi/data or use airplane mode)
2. **Queue an action**:
   ```typescript
   const { queueAction } = useOfflineQueue();
   await queueAction('test-action', { data: 'test' });
   ```
3. **Expected**:
   - Action is added to queue
   - Status is "queued"
   - Action is persisted to AsyncStorage

#### C. Test Auto-Processing
1. **Queue some actions while offline**
2. **Go online** (turn on WiFi/data)
3. **Expected**:
   - Queue automatically starts processing
   - Actions are executed in order
   - Completed actions are removed from queue

#### D. Test Retry Logic
1. Register a handler that fails:
   ```typescript
   registerActionHandler('failing-action', async () => {
     throw new Error('Test error');
   });
   ```
2. Queue the action while offline
3. Go online
4. **Expected**:
   - Action tries to execute
   - Fails and retries (up to 3 times)
   - Exponential backoff between retries
   - After 3 failures, status becomes "failed"

#### E. Test Manual Retry
1. Find a failed action in the queue
2. Call `retryAction(actionId)`
3. **Expected**: Action status resets to "queued" and retries

#### F. Test Clear Queue
1. Queue some actions
2. Call `clearQueue()`
3. **Expected**: All actions removed from queue and storage

### Integration Test: Checkout Offline
1. **Add items to cart**
2. **Go offline**
3. **Try to checkout** (should queue the order)
4. **Go online**
5. **Expected**: Order is automatically processed when online

---

## 3. Testing Custom Hooks (Phase 17)

### A. Test useDebouncedSearch Hook

#### Create a Test Component
```typescript
import { useDebouncedSearch } from '../hooks';

const TestSearch = () => {
  const { searchValue, setSearchValue, debouncedValue, clearSearch } = useDebouncedSearch(500);

  return (
    <View>
      <TextInput
        value={searchValue}
        onChangeText={setSearchValue}
        placeholder="Type to search..."
      />
      <Text>Current: {searchValue}</Text>
      <Text>Debounced: {debouncedValue}</Text>
      <Button onPress={clearSearch}>Clear</Button>
    </View>
  );
};
```

#### Test Steps
1. Type in the input field
2. **Expected**: 
   - `searchValue` updates immediately
   - `debouncedValue` updates after 500ms delay
3. Type quickly multiple times
4. **Expected**: `debouncedValue` only updates after you stop typing for 500ms
5. Tap "Clear"
6. **Expected**: Both values reset to empty string

### B. Test useVoiceSearch Hook

#### Create a Test Component
```typescript
import { useVoiceSearch } from '../hooks';

const TestVoice = () => {
  const { state, transcript, startListening, stopListening, clearTranscript, speak } = useVoiceSearch();

  return (
    <View>
      <Text>State: {state}</Text>
      <Text>Transcript: {transcript}</Text>
      <Button onPress={startListening}>Start Listening</Button>
      <Button onPress={stopListening}>Stop Listening</Button>
      <Button onPress={clearTranscript}>Clear</Button>
      <Button onPress={() => speak('Hello, this is a test')}>Speak</Button>
    </View>
  );
};
```

#### Test Steps
1. **Test Start Listening**:
   - Tap "Start Listening"
   - **Expected**: 
     - State changes to "listening"
     - After 3 seconds, state changes to "processing"
     - After another 1 second, state changes to "done" with mock transcript
     - After 2 seconds, state resets to "idle"

2. **Test Stop Listening**:
   - Tap "Start Listening"
   - Immediately tap "Stop Listening"
   - **Expected**: State changes to "processing", then "done"

3. **Test Speak**:
   - Tap "Speak" button
   - **Expected**: Text is spoken using device text-to-speech

4. **Test Clear Transcript**:
   - After getting a transcript, tap "Clear"
   - **Expected**: Transcript is cleared, state resets to "idle"

---

## 4. Testing Form Components (Phase 18)

### A. Test FormInput Component

#### Test in a Form
```typescript
import { FormInput } from '../components/forms';

<FormInput
  label="Name"
  value={name}
  onChangeText={setName}
  placeholder="Enter your name"
  error={nameError}
  helperText="This will be displayed on your profile"
  required
/>
```

#### Test Cases
1. **Basic Input**: Type text, verify it updates
2. **Error State**: Set error prop, verify red border and error message
3. **Helper Text**: Verify helper text displays below input
4. **Required Field**: Verify asterisk (*) appears
5. **Disabled State**: Set disabled=true, verify input is not editable
6. **Multiline**: Set multiline=true, verify text area expands
7. **Icons**: Test leftIcon and rightIcon props
8. **Accessibility**: Use screen reader, verify labels are announced

### B. Test PhoneInput Component

#### Test Cases
1. **Input Formatting**:
   - Type digits: `8012345678`
   - **Expected**: Displays as `801 234 5678`
   - Value stored as `+2348012345678`

2. **Validation**:
   - Type letters - should be filtered out
   - Type more than 10 digits - should be limited

3. **Country Code**:
   - **Expected**: `+234` prefix is always visible and non-editable

### C. Test OTPInput Component

#### Test Cases
1. **Auto-Focus**:
   - Type a digit in first box
   - **Expected**: Focus automatically moves to next box

2. **Backspace**:
   - Press backspace in an empty box
   - **Expected**: Focus moves to previous box

3. **Paste**:
   - Paste a 6-digit code
   - **Expected**: Each digit fills corresponding box

4. **Error State**:
   - Set error prop
   - **Expected**: All boxes show red border

### D. Test Select Component

#### Test Cases
1. **Open Menu**:
   - Tap select button
   - **Expected**: Menu opens with options

2. **Select Option**:
   - Tap an option
   - **Expected**: Menu closes, selected value displays

3. **Disabled Option**:
   - Tap a disabled option
   - **Expected**: Option doesn't select

4. **Required Field**: Verify asterisk appears

### E. Test CouponInput Component

#### Test Cases
1. **Apply Coupon**:
   - Enter coupon code
   - Tap "Apply"
   - **Expected**: 
     - Shows loading state
     - If valid: Shows success message, button changes to "Remove"
     - If invalid: Shows error message

2. **Remove Coupon**:
   - After applying, tap "Remove"
   - **Expected**: Coupon cleared, button changes back to "Apply"

3. **Validation**: Empty input should disable Apply button

### F. Test GeoPicker Component

#### Test Cases
1. **Select Location**:
   - Tap "Select Location on Map"
   - **Expected**: 
     - Shows loading state
     - After 1 second, shows mock location
     - Button changes to "Change"

2. **Change Location**:
   - Tap "Change" button
   - **Expected**: Opens picker again

3. **Display**:
   - After selecting, verify address and coordinates display

---

## 5. Testing Debug Screen (Phase 22)

### Access Debug Screen

**Option 1: Add to Navigation**
Add DebugScreen to CustomerStack navigation:

```typescript
import DebugScreen from '../screens/debug/DebugScreen';

<Stack.Screen
  name="Debug"
  component={DebugScreen}
  options={{ headerShown: true, title: 'Debug' }}
/>
```

**Option 2: Add Button in Profile**
Add a hidden button in Profile screen (tap 5 times to reveal, or just add normally):

```typescript
<List.Item
  title="Debug Tools"
  left={(props) => <List.Icon {...props} icon="bug" />}
  onPress={() => navigation.navigate('Debug')}
/>
```

### Test Debug Features

#### A. Environment Info
1. Open Debug screen
2. **Expected**: 
   - Shows environment (development/staging/production)
   - Shows Mock Mode toggle
   - Shows API Base URL
   - Shows Network Status
   - Shows User ID

#### B. Toggle Mock Mode
1. Toggle "Mock Mode" switch
2. **Expected**: 
   - Config updates
   - API calls switch between mock/real

#### C. View Offline Queue
1. **Expected**: 
   - Shows queue status (processing or count)
   - Shows "Clear Queue" button

#### D. Clear All Storage
1. Tap "Clear All Storage" button
2. **Expected**: 
   - Alert confirms action
   - All AsyncStorage and SecureStore cleared
   - User logged out (if tokens were stored)

#### E. View Cached Data
1. Tap "View Cached Data" button
2. **Expected**: 
   - Shows JSON of all cached data
   - Includes cart, preferences, etc.

---

## 6. Integration Testing

### Test Complete User Flow with New Features

#### Flow 1: Browse → Add to Cart → Checkout (Offline)
1. Browse products (online)
2. Add items to cart
3. **Go offline** (airplane mode)
4. Try to checkout
5. **Expected**: 
   - Order is queued
   - User sees queued status
6. **Go online**
7. **Expected**: Order automatically processes

#### Flow 2: Receive Notification → View → Navigate
1. Simulate receiving a notification (or use mock data)
2. Open NotificationList
3. Tap on order notification
4. **Expected**: Navigates to OrderDetail screen

#### Flow 3: Voice Search → Product Search
1. Use voice search (mock implementation)
2. Get transcript
3. Use transcript in search
4. **Expected**: Products filtered by voice query

---

## 7. Testing Offline Functionality

### Test Offline Queue with Real Actions

#### Register Checkout Handler
In your checkout screen or App.tsx:

```typescript
import { registerActionHandler } from '../hooks';

// Register checkout handler
registerActionHandler('checkout', async (payload) => {
  const { api } = useConfig();
  return api.orders.create(payload);
});
```

#### Test Steps
1. Add items to cart
2. Go to checkout
3. Fill in address
4. **Go offline** before placing order
5. Tap "Place Order"
6. **Expected**: 
   - Order is queued
   - User sees "Order queued, will process when online"
7. **Go online**
8. **Expected**: 
   - Order automatically processes
   - User receives confirmation

---

## 8. Manual Testing Checklist

### Notifications Screen
- [ ] All notifications display correctly
- [ ] Filter tabs work (All/Unread)
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Deep linking navigates correctly
- [ ] Pull to refresh works
- [ ] Empty states display correctly
- [ ] Icons and colors match notification types

### Offline Queue
- [ ] Actions queue when offline
- [ ] Queue persists after app restart
- [ ] Actions process automatically when online
- [ ] Retry logic works (exponential backoff)
- [ ] Failed actions show correct status
- [ ] Manual retry works
- [ ] Clear queue works

### Custom Hooks
- [ ] useDebouncedSearch delays correctly
- [ ] useVoiceSearch state transitions work
- [ ] Voice search transcript appears
- [ ] Speak function works

### Form Components
- [ ] FormInput displays correctly
- [ ] PhoneInput formats correctly
- [ ] OTPInput auto-focuses
- [ ] Select opens menu
- [ ] CouponInput applies/removes
- [ ] GeoPicker selects location

### Debug Screen
- [ ] Environment info displays
- [ ] Mock mode toggle works
- [ ] Queue status shows
- [ ] Clear storage works
- [ ] View cached data works

---

## 9. Automated Testing (Future)

### Unit Tests
```typescript
// Example test for useDebouncedSearch
describe('useDebouncedSearch', () => {
  it('should debounce search input', async () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
// Example test for offline queue
describe('Offline Queue', () => {
  it('should queue actions when offline', async () => {
    // Test implementation
  });
});
```

---

## 10. Troubleshooting

### Notifications Not Showing
- Check if user is logged in
- Verify API is returning notifications
- Check network status

### Offline Queue Not Working
- Verify action handlers are registered
- Check AsyncStorage permissions
- Verify network status detection

### Form Components Not Working
- Check if React Native Paper is installed
- Verify theme is properly configured
- Check for TypeScript errors

### Debug Screen Not Accessible
- Add it to navigation
- Or create a dev-only button

---

## Quick Test Commands

### Run All Tests (when implemented)
```bash
npm test
```

### Run Specific Test
```bash
npm test -- NotificationList
```

### Check TypeScript
```bash
npx tsc --noEmit
```

### Check Linting
```bash
npm run lint
```

---

## Testing Tips

1. **Use Mock Mode**: Test with `MOCK_MODE=true` for consistent results
2. **Use Debug Screen**: Access debug tools for testing
3. **Test Offline**: Use airplane mode to test offline features
4. **Check Console**: Monitor console logs for errors
5. **Test Edge Cases**: Empty states, errors, network failures
6. **Test Accessibility**: Use screen readers for accessibility testing

---

## Need Help?

- Check console logs for errors
- Review component code in `src/components/`
- Check hook implementations in `src/hooks/`
- Review API contracts in `backend-handoff.md`
- Check architecture in `ARCHITECTURE.md`



