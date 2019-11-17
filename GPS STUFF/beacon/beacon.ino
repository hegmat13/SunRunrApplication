/*********************************************************************
  This is an example for our nRF51822 based Bluefruit LE modules

  Pick one up today in the adafruit shop!

  Adafruit invests time and resources providing this open source code,
  please support Adafruit and open-source hardware by purchasing
  products from Adafruit!

  MIT license, check LICENSE for more information
  All text above, and the splash screen below must be included in
  any redistribution
*********************************************************************/

#include <Arduino.h>
#include <SPI.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"
#include <Adafruit_GPS.h>

#include "BluefruitConfig.h"

#if SOFTWARE_SERIAL_AVAILABLE
#include <SoftwareSerial.h>
#endif

/*=========================================================================
    APPLICATION SETTINGS

      FACTORYRESET_ENABLE     Perform a factory reset when running this sketch
     
                              Enabling this will put your Bluefruit LE module
                            in a 'known good' state and clear any config
                            data set in previous sketches or projects, so
                              running this at least once is a good idea.
     
                              When deploying your project, however, you will
                            want to disable factory reset by setting this
                            value to 0.  If you are making changes to your
                              Bluefruit LE device via AT commands, and those
                            changes aren't persisting across resets, this
                            is the reason why.  Factory reset will erase
                            the non-volatile memory where config data is
                            stored, setting it back to factory default
                            values.
         
                              Some sketches that require you to bond to a
                            central device (HID mouse, keyboard, etc.)
                            won't work at all with this feature enabled
                            since the factory reset will clear all of the
                            bonding data stored on the chip, meaning the
                            central device won't be able to reconnect.

    BEACON_MANUFACTURER_ID  Company Identifier assigned by Bluetooth SIG
                            Full list of Manufacturer ID can be found here
                            https://www.bluetooth.org/en-us/specification/assigned-numbers/company-identifiers
    BEACON_UUID             16-bytes UUID in hex format AA-BB-...
    BEACON_MAJOR            16-bit major nunber
    BEACON_MINOR            16-bit minor nunber
    BEACON_RSSI_1M
    -----------------------------------------------------------------------*/
#define FACTORYRESET_ENABLE      0

#define MANUFACTURER_APPLE         "0x004C"
#define MANUFACTURER_NORDIC        "0x0059"

#define BEACON_MANUFACTURER_ID     MANUFACTURER_APPLE
#define BEACON_UUID                "01-12-23-34-45-56-67-78-89-9A-AB-BC-CD-DE-EF-F0"
#define BEACON_MAJOR               "0x0000"
#define BEACON_MINOR               "0x0000"
#define BEACON_RSSI_1M             "-54"
#define MINIMUM_FIRMWARE_VERSION    "0.6.6"
#define MODE_LED_BEHAVIOUR          "MODE"
#define beaconid                    1
/*=========================================================================*/

// Create the bluefruit object, either software serial...uncomment these lines
/*
  SoftwareSerial bluefruitSS = SoftwareSerial(BLUEFRUIT_SWUART_TXD_PIN, BLUEFRUIT_SWUART_RXD_PIN);

  Adafruit_BluefruitLE_UART ble(bluefruitSS, BLUEFRUIT_UART_MODE_PIN,
                      BLUEFRUIT_UART_CTS_PIN, BLUEFRUIT_UART_RTS_PIN);
*/

/* ...or hardware serial, which does not need the RTS/CTS pins. Uncomment this line */
Adafruit_BluefruitLE_UART ble(BLUEFRUIT_HWSERIAL_NAME, BLUEFRUIT_UART_MODE_PIN);

/* ...hardware SPI, using SCK/MOSI/MISO hardware SPI pins and then user selected CS/IRQ/RST */
//Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);

/* ...software SPI, using SCK/MOSI/MISO user-defined SPI pins and then user selected CS/IRQ/RST */
//Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_SCK, BLUEFRUIT_SPI_MISO,
//                             BLUEFRUIT_SPI_MOSI, BLUEFRUIT_SPI_CS,
//                             BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);


// A small helper
void error(const __FlashStringHelper*err) {
  while (1) {
    Serial.println(err);
    delay(5000);
  }
}

#define GPSSerial Serial1
#define XBEESerial Serial3
Adafruit_GPS GPS(&GPSSerial);
#define GPSECHO false
double beaconLat;
double beaconLong;
int beaconTime[7] = {99, 99, 99, 99, 99, 99, 99};
;

uint32_t timer = millis();

/**************************************************************************/
/*!
    @brief  Sets up the HW an the BLE module (this function is called
            automatically on startup)
*/
/**************************************************************************/
void setup(void)
{
  while (!Serial);  // required for Flora & Micro
  delay(500);       // This may not be necessary, but it doesn't seem to be hurting anything

  XBEESerial.begin(38400);  // Baud rate from Nicole - shouldn't matter, but for consistency...
  Serial.begin(115200);     // Higher baud rate to reduce impact on performance due to debugging

  Serial.println("Adafruit GPS library basic test!");

  // 9600 NMEA is the default baud rate for Adafruit MTK GPS's- some use 4800
  GPS.begin(9600);
  // uncomment this line to turn on RMC (recommended minimum) and GGA (fix data) including altitude
  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
  // uncomment this line to turn on only the "minimum recommended" data
  //GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCONLY);
  // For parsing data, we don't suggest using anything but either RMC only or RMC+GGA since
  // the parser doesn't care about other sentences at this time
  // Set the update rate
  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ); // 1 Hz update rate
  // For the parsing code to work nicely and have time to sort thru the data, and
  // print it out we don't suggest using anything higher than 1 Hz

  // Request updates on antenna status, comment out to keep quiet
  GPS.sendCommand(PGCMD_ANTENNA);

  beaconLat = 9999.99;
  beaconLong = 9999.99;
  delay(1000); // Delay is copied from GPS example code, may not be necessary

  // Ask for firmware version
  GPSSerial.println(PMTK_Q_RELEASE);

  Serial.println(F("Adafruit Bluefruit Beacon Example"));
  Serial.println(F("---------------------------------"));

  /* Initialise the module */
  Serial.print(F("Initialising the Bluefruit LE module: "));

  if ( !ble.begin(VERBOSE_MODE) )
  {
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
  Serial.println( F("OK!") );

  if ( FACTORYRESET_ENABLE )
  {
    /* Perform a factory reset to make sure everything is in a known state */
    Serial.println(F("Performing a factory reset: "));
    if ( ! ble.factoryReset() ) {
      error(F("Couldn't factory reset"));
    }
  }

  /* Disable command echo from Bluefruit */
  ble.echo(false);

  Serial.println("Requesting Bluefruit info:");
  /* Print Bluefruit information */
  ble.info();

  Serial.println(F("Setting beacon configuration details: "));

  // AT+BLEBEACON=0x004C,01-12-23-34-45-56-67-78-89-9A-AB-BC-CD-DE-EF-F0,0x0000,0x0000,-54
  ble.print("AT+BLEBEACON="        );
  ble.print(BEACON_MANUFACTURER_ID ); ble.print(',');
  ble.print(BEACON_UUID            ); ble.print(',');
  ble.print(BEACON_MAJOR           ); ble.print(',');
  ble.print(BEACON_MINOR           ); ble.print(',');
  ble.print(BEACON_RSSI_1M         );
  ble.println(); // print line causes the command to execute

  // check response status
  while (! ble.waitForOK() ) { // Hang until bluetooth is connected
    Serial.println(F("Bluetooth is not available, retry in 5 seconds"));
    delay(5000);
  }


  Serial.println();
  Serial.println(F("Open your beacon app to test"));

  //Serial.println(F("Please use Adafruit Bluefruit LE app to connect in UART mode"));
  //Serial.println(F("Then Enter characters to send to Bluefruit"));
  Serial.println();

  ble.verbose(false);  // debug info is a little annoying after this point!

  /* Wait for connection */
  // DEBUG: This is only here for testing, and will be removed before deployment
  while (! ble.isConnected()) {
    delay(500);
  }

  // LED Activity command is only supported from 0.6.6
  if ( ble.isVersionAtLeast(MINIMUM_FIRMWARE_VERSION) )
  {
    // Change Mode LED Activity
    Serial.println(F("******************************"));
    Serial.println(F("Change LED activity to " MODE_LED_BEHAVIOUR));
    ble.sendCommandCheckOK("AT+HWModeLED=" MODE_LED_BEHAVIOUR);
    Serial.println(F("******************************"));
  }
}

/**************************************************************************/
/*!
    @brief  Constantly poll for new command or response data
*/
/**************************************************************************/
void loop(void)
{
  //TODO: Move these to the setup / make them global

  // read data from the GPS in the 'main loop'
  while (GPSSerial.available()) {
    char c = GPS.read();
    // if you want to debug, this is a good time to do it!
    if (GPSECHO)
      if (c) Serial.print(c);
  }
  // if a sentence is received, we can check the checksum, parse it...
  if (GPS.newNMEAreceived()) {
    // a tricky thing here is if we print the NMEA sentence, or data
    // we end up not listening and catching other sentences!
    // so be very wary if using OUTPUT_ALLDATA and trytng to print out data
    //Serial.println(GPS.lastNMEA()); // this also sets the newNMEAreceived() flag to false
    if (!GPS.parse(GPS.lastNMEA())) { // this also sets the newNMEAreceived() flag to false
      //Serial.println("Couldn't parse most recent NMEA string");
      //return; // we can fail to parse a sentence in which case we should just wait for another
    }
  }
  // if millis() or timer wraps around, we'll just reset it
  if (timer > millis()) {
    timer = millis();
  }

  // approximately every 2 seconds or so, print out the current stats
  if (millis() - timer > 2000) {
    timer = millis(); // reset the timer
    Serial.print("\nTime: ");
    Serial.print(GPS.hour, DEC); Serial.print(':');
    Serial.print(GPS.minute, DEC); Serial.print(':');
    Serial.print(GPS.seconds, DEC); Serial.print('.');
    Serial.println(GPS.milliseconds);
    Serial.print("Date: ");
    Serial.print(GPS.day, DEC); Serial.print('/');
    Serial.print(GPS.month, DEC); Serial.print("/20");
    Serial.println(GPS.year, DEC);
    Serial.print("Fix: "); Serial.print((int)GPS.fix);
    Serial.print(" quality: "); Serial.println((int)GPS.fixquality);
    if (GPS.fix) {
      Serial.print("Location: ");
      Serial.print(GPS.latitude, 4); Serial.print(GPS.lat);
      Serial.print(", ");
      Serial.print(GPS.longitude, 4); Serial.println(GPS.lon);
      Serial.print("Speed (knots): "); Serial.println(GPS.speed);
      Serial.print("Angle: "); Serial.println(GPS.angle);
      Serial.print("Altitude: "); Serial.println(GPS.altitude);
      Serial.print("Satellites: "); Serial.println((int)GPS.satellites);
      beaconLat = GPS.latitude;
      beaconLong = GPS.longitude;
      beaconTime[0] = GPS.hour;
      beaconTime[1] = GPS.minute;
      beaconTime[2] = GPS.seconds;
      beaconTime[3] = GPS.milliseconds;
      beaconTime[4] = GPS.month;
      beaconTime[5] = GPS.day;
      beaconTime[6] = GPS.year;
    }
  }
  ble.println("AT+BLEUARTRX");
  ble.readline(); // Copy the BLE serial buffer into the BLE response buffer
  if (strcmp(ble.buffer, "OK") == 0) {  // Check the contents of the BLE response buffer
    // no data
  }
  else {
    // Some data was found, its in the buffer
    Serial.print(F("[Recv] ")); Serial.println(ble.buffer);
    bool bleFlag = false;
    //int bbuffSize = sizeof(ble.buffer)/sizeof(ble.buffer[0]);
    unsigned int bbuffSize = ((String)ble.buffer).length();
    Serial.println(bbuffSize);
    if (ble.buffer[0] == '#' && ble.buffer[bbuffSize - 1] == '~') {
      bleFlag = true; // There is a valid message
    }
    else {
      bleFlag = false; // There is not a valid message
    }
    if (bleFlag) {
      //Serial.print(ble.buffer[1]);
      //Serial.println(ble.buffer[2]);
      if (ble.buffer[1] == 'A' && ble.buffer[2] == 'T') {
        String messageAlert = ((String)ble.buffer).substring(0, bbuffSize - 1) + ",BI," + (String)beaconid + "~";
        Serial.print("[Send] ");
        Serial.println(messageAlert);
        XBEESerial.println(messageAlert);

        //TODO: pass to main station
      }
      else if (ble.buffer[1] == 'G' & ble.buffer[2] == 'P') {
        String messageGPS = "#GP,LT," + (String)beaconLat + ",LN," + (String)beaconLong + "~";
        Serial.println(messageGPS);
        ble.print("AT+BLEUARTTX=");
        ble.println(messageGPS);
      }
      else {
        Serial.print("Unknown Command Received");
      }
    }
  }
  //ble.waitForOK();
  String xBeeBuff = "";
  unsigned int xbuffSize;
  while (XBEESerial.available()) {
    Serial.println("inside while loop");
    xBeeBuff  = XBEESerial.readString();
    xbuffSize = ((String)xBeeBuff).length();
    Serial.println(xBeeBuff);
    Serial.println((String)xbuffSize);
  }
  bool xBeeFlag = false;
  if (xBeeBuff[0] == '#' && xBeeBuff[xbuffSize - 1] == '~') {
    xBeeFlag = true;
  }
  else {
    xBeeFlag = false;
  }

  if (xBeeFlag) {
    if (xBeeBuff[1] == 'A' && xBeeBuff[2] == 'T') {
      String messageMainAck = xBeeBuff.substring(0, xbuffSize);
      ble.print("AT+BLEUARTTX=");
      ble.println(messageMainAck);
    }
    else if (xBeeBuff[1] == 'P' && xBeeBuff[2] == 'G' && xbuffSize == 4) {
      String messageBeaconAck = "#PG,ID," + (String)beaconid + ",LT," + (String)beaconLat + ",LN," + (String)beaconLong + ",TH," + beaconTime[0] + ",TM," + beaconTime[1] + ",TS," + beaconTime[2] + ",TF," + beaconTime[3] + ",TO," + beaconTime[4] + ",TD," + beaconTime[5] + ",TY," + beaconTime[6] + "~";

      Serial.println(messageBeaconAck);
      XBEESerial.println(messageBeaconAck);
    }
    else {
      Serial.println("invalid Xbee message");
    }
  }
}

/**************************************************************************/
/*!
    @brief  Checks for user input (via the Serial Monitor)
*/
/**************************************************************************/
bool getUserInput(char buffer[], uint8_t maxSize)
{
  // timeout in 100 milliseconds
  TimeoutTimer timeout(100);

  memset(buffer, 0, maxSize);
  while ( (!Serial.available()) && !timeout.expired() ) {
    delay(1);
  }

  if ( timeout.expired() ) return false;

  delay(2);
  uint8_t count = 0;
  do
  {
    count += Serial.readBytes(buffer + count, maxSize);
    delay(2);
  } while ( (count < maxSize) && (Serial.available()) );

  return true;
}
