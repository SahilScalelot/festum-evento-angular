import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

export class Message {
  constructor(
    public author: any,
    public content: any,
    public date: Date
  ) {}
}

@Injectable()

export class HelpService {
  constructor(private router:Router) {}
  conversation = new Subject<Message[]>();
  messageMap: any = {
    "hi": "Hello",
    "how are you": " I don't have feelings or states of well-being, but I'm here and ready to assist you. How can I help you today?",
    "who are you": "<a href='http://localhost:4200/#/faq'>123</a>",
    "what is your role": "Just guide for the user",
    "login": "<div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>i. What shall I do if I do not receive OTP?</h5><p>If you did not receive OTP by email or mobile number, then please contact us and send your complaint via email on the email address <a class='text-magicPotion hover:opacity-75 anim' href='mailto:info@festumevento.com'>info@festumevento.com</a></p></div> <div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>ii. While setting the password, it shows PASSWORD ERROR.</h5><p>While setting the password, make sure your password is of 8 characters, 5 alphabets, 2 number and 1 symbol. <strong>For example-ABCDE12$</strong></p></div> <div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>iii. What should I do if I forget my password?</h5><p class=''>In case you forget your password, please follow the following steps:</p><ul class='pl-3'><li>- Click on the forgot password option.</li><li>- Enter your mobile number.</li><li>- Confirm your OTP once you receive it on the above entered number.</li><li>- Reset Your Password</li></ul></div>",
    "event": "<div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>i. What are the features and functions available while searching events?</h5><ul class='pl-3'><li>- We serve maximum events, offers, online product offers and Live Streaming on this platform. </li><li>- You can see worldwide events and offers on single click</li><li>- You can apply numerous filters anytime anywhere by ratings and locations</li><li>- Create b2b, b2c, c2c events and other multiple events at a single time.</li></ul></div><div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>ii. How do I list my event?</h5><ul class='pl-3'><li>- On the home page click on the “Get Started” button.</li><li>- On the event page click on the “Create New Event” button and fill up all the necessary details. </li><li>- On the permission form enable the “Accept Booking” check box.</li> <li>- After you complete filling out all the forms, save the entered data. </li></ul> </div><div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>iii. How do I promote my event?</h5><ul class='pl-3'><li>- After saving the details of your upcoming event, wait for your event to be verified. Once verified, click on the “Live” toggle at the right corner of your listing. Your event listing will now be visible to viewers and they can make bookings. </li></ul></div><div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>iv. How do I list my event?</h5><ul class='pl-3'><li>- On the home page click on the “Get Started” button. </li><li>- On the event page click on the “Create New Event” button and fill up all the necessary details.   </li><li>- On the permission form enable the “Accept Booking” check box.</li><li>- After you complete filling out all the forms, save the entered data.  </li></ul></div><div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>v. How do I promote my event?</h5><ul class='pl-3'><li>- After saving the details of your upcoming event, wait for your event to be verified. Once verified, click on the “Live” toggle at the right corner of your listing. Your event listing will now be visible to viewers and they can make bookings.</li></ul><div><div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>vi. How do I livestream my event?</h5><ul class='pl-3'><li>- On the home page, click on the “Get Started” button. </li><li>- Go to the “Live Stream” option from the panel on the left.  </li><li>- Click on the “Create New” button on the top right of the page </li><li>- Do as instructed to livestream your event. </li></ul></div><div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>vii. Why can’t I change my event date?</h5><ul class='pl-3'><li>- Once made live, the date of an event cannot be changed. You will need to cancel the current event and create a new one in case of a change in the date. </li></ul></div><div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>viii. Why isn’t my event verified?</h5><ul class='pl-3'><li>- It may take 24 hours - 72 hours for an event to get verified. </li>  </ul></div>",
    "offer": "<div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>i. What are the different options to add offers?</h5><ul class='pl-3'><li>- One shop and all categories with the same offer.</li><li>- One shop and 7 different category offers.</li><li>- Multiple shops and all categories have the same offer.</li><li>- Multiple shops and 7 different category offers.</li></ul></div><div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>ii. How to Publish an Offer for My Shop/Offline Store?</h5><ul class='pl-3'><li>- On the home page, click on the “Get Started” button.</li><li>- Go to “Offline Shop Offers”</li><li>- Click the “Add Shop” button on the top right to list your shop.</li><li>- Add a poster, write your shop’s name, choose a category, mention the working days and times, write a description, select your location on the map, fill in the address, provide links to social media accounts, and save.</li><li>- After the shop gets added, check on your list at “Running offers”</li><li>- Click on the “Create Offer” button on the right.</li><li>- Provide a title to your offer, mention the starting and ending date, add a poster or video, write a description, and press continue.</li><li>- Choose whether the offer is on a specific product or all products, select the offer type, mention the person limit, write a description of the limit, mention the percentage/rupees of discount, and press the “Continue” button.</li><li>- Write your terms and conditions if any, click the check box to accept our terms and conditions, and Save.</li><li>- Wait for your offer to be verified by us, and then your offer will be made live for the users.</li></ul></div><div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>iii. How to Publish an Offer for My Online Store?</h5><ul class='pl-3'><li>- On the home page, click on the “Get Started” button.</li><li>- Go to Online Offers</li><li>- Click on the “Create New” button to add your online shop.</li><li>- Provide your shop name, offer percentage or amount, offer start and end date, product name, poster, additional photos of the products, description, name of the platform, and link to your e-store. </li><li>- Then press “Save and Continue” on the top right of the page.</li><li>- Wait for the offer to be verified by us. Then switch On the offer status to make it available to the users.</li></ul></div>",
    "livestream": "<div class='space-y-1.5'><h5 class='text-ev-dark opacity-60 text-lg'>i. How do I livestream my event?</h5><ul class='pl-3'><li>- On the home page, click on the “Get Started” button. </li><li>- Go to the “Live Stream” option from the panel on the left.</li><li>- Click on the “Create New” button on the top right of the page </li><li>- Do as instructed to livestream your event. </li></ul></div>",
    "aboutdeposit": "I can't understand your text. Can you please repeat",
    "somethingelse": "<div class='text-massage left-massage'><div class='bg-white p-2.5' ><div>Welcome to Festum Evento! Kindly let me know what are you looking for.</div><span class='arrow'></span><div class='w-full flex items-center flex-wrap' ><div class='w-fit pl-0 p-2.5' *ngFor='let item of butten'><button type='button' [ngClass]='item.isSelected ? 'bg-magicPotion text-white' : 'bg-white text-magicPotion'' class='border-2 border-magicPotion text-[14px] leading-4 font-medium rounded-md shadow-3xl py-1.5 px-4' (click)='itemvalue(item)'>{{item.btnName}}</button></div></div></div><p style='padding: 0;'><span class='whitespace-nowrap'> 3:18 PM </span></p></div>",
    "defaultmsg": "I can't understand your text. Can you please repeat"
  }
  getBotAnswer(msg: any) {    
    var userMessage = new Message('user', msg, new Date());
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg), new Date());

      setTimeout(()=>{
        this.conversation.next([botMessage]);
      }, 500);
    }
  
  getBotMessage(question: any = ''){
    question = question.toLowerCase();
    let answer = this.messageMap[question];
    return answer || this.messageMap['defaultmsg'];
  }

}