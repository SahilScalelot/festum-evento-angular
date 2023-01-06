import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  
  faqObj: any = [
    {
      title: 'What Is The Meaning Of Lorem Ipsum?',
      description: 'You Can Create A New Account At The End Of The Order Process Or On The Following Page: Create New Account. You Can View All Of Your Orders And Subscriptions In Your Customer Account. You Can Also Change Your Addresses And Your Password.'
    },
    {
      title: 'Where On Your Website Can I Open A Customer Account?',
      description: 'You Can Create A New Account At The End Of The Order Process Or On The Following Page: Create New Account. You Can View All Of Your Orders And Subscriptions In Your Customer Account. You Can Also Change Your Addresses And Your Password.'
    },
    {
      title: 'Do I Need To Create An Account To Make An Order?',
      description: 'You Can Create A New Account At The End Of The Order Process Or On The Following Page: Create New Account. You Can View All Of Your Orders And Subscriptions In Your Customer Account. You Can Also Change Your Addresses And Your Password.'
    },
    {
      title: 'Why Do The Prices In The Shop Sometimes Change?',
      description: 'You Can Create A New Account At The End Of The Order Process Or On The Following Page: Create New Account. You Can View All Of Your Orders And Subscriptions In Your Customer Account. You Can Also Change Your Addresses And Your Password.'
    },
    {
      title: 'Do You Also Sell Magazines That Have Been Financed By Crowdfunding?',
      description: 'You Can Create A New Account At The End Of The Order Process Or On The Following Page: Create New Account. You Can View All Of Your Orders And Subscriptions In Your Customer Account. You Can Also Change Your Addresses And Your Password.'
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
