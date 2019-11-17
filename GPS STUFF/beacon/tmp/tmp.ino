 int i = 0;
void setup() {
  // put your setup code here, to run once:
  Serial3.begin(38400);
  Serial2.begin(38400);
  Serial1.begin(38400);
  Serial.begin(115200);
 
}

void loop() {
  // put your main code here, to run repeatedly:
  while(1){
    Serial3.println(i);
    Serial1.println(i);
    Serial2.begin(38400);
    Serial.println(i);
    delay(100);
    i++;
    }
}
