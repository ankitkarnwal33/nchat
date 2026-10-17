"use client";
import { InstagramMedia } from "@/types/types";
import MediaCard from "./MediaCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTRPCClient } from "../trpc/client";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { IoMdImage } from "react-icons/io";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

const ReelsData: InstagramMedia[] = [
  {
    id: "17953987941263562",
    caption:
      "Don’t you think it’s pretty 😍 \n.\n.\n.\n.\nHunter 350, hunter 350 tokyo black, tokyo black, Royal Enfield hunter 350, Royal Enfield, hunter 350 bike, bike ride, bike post, hunter 350 mileage, hunter tokyo black 350\n#hunter350 #viral #instapost #350ccbullet🤙🏻__📍❤️‍🔥💫 #huntertokyoblack350",
    media_type: "CAROUSEL_ALBUM",
    media_url:
      "https://scontent-del3-1.cdninstagram.com/v/t51.82787-15/851829362_17953145550272512_4419532134636810930_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=mFL1RejkXH4Q7kNvwEMJ8Xp&_nc_oc=AdqWe9c8Efhb7NAXSD3FjellrlQ3cnMMTVbCF3qi45QEmvkB4kzVEkb-SDuWCcv3KZ4&_nc_zt=23&_nc_ht=scontent-del3-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&_nc_tpa=Q5bMBQLGgtg-7STyCpY2Ri5lCMQUw7qFPjNJ9kWPvqMoQPY7y5V86DHHQzvwx_Ah28Yjv2wj4DCGM8g-cQ&oh=00_AQOlY_frgrb_DETz1BxVPuc6GYXyB0U8HdFCdp0HQYUWEg&oe=6AD9822C",
    timestamp: "2026-10-16T14:09:42+0000",
    username: "ankitkarnwal33",
    permalink: "https://www.instagram.com/p/Dejtv9UGKnj/",
  },
  {
    id: "18347514079268041",
    caption:
      "Self respect is most important thing in this selfish world…\n\nHunter 350 tokyo black, tokyo black hunter 350, hunter 350, hunter, Royals Enfield, Royal Enfield hunter 350, hunter royal Enfield, hunter mileage, motivation, cruel world\n\n#instagood #hunter350 #royalenfield",
    media_type: "VIDEO",
    media_url:
      "https://scontent-del3-1.cdninstagram.com/o1/v/t2/f2/m86/AQPpUPEmKWjLNcMWBs0vHwd3XyJFdUg2xC0lQQ7yEjg5zB9ODsY7XJsWUtuCIP5ccXiPZ9Vjf-ffwh8Q1gIIzYo0YbZ9I-wUFqAUAwE.mp4?_nc_cat=106&_nc_sid=5e9851&_nc_ht=scontent-del3-1.cdninstagram.com&_nc_ohc=Y1D9qBRt9XkQ7kNvwFQTE8S&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6NDQ5NDI1MjI5NDE0OTI4MCwiYXNzZXRfYWdlX2RheXMiOjIsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjozMSwidXJsZ2VuX3NvdXJjZSI6Ind3dyJ9&ccb=17-1&vs=8563854f9049b1da&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC8xQTUwM0U3NjU1QkM0NjU1QTA4RDQ2OTM1NDg4MzI4N192aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYUWlnX3hwdl9wbGFjZW1lbnRfcGVybWFuZW50X3YyLzYyRUQwM0IzNUY4OTQ2MjM5QjVCNTJFRkUwNzUwNzMzX2F1ZGlvX2Rhc2hpbml0Lm1wNBUCAsgBEgAoABgAGwKIB3VzZV9vaWwBMRJwcm9ncmVzc2l2ZV9yZWNpcGUBMRUAACbA0rD49N_7DxUCKAJDMywXQD-iDEm6XjUYEmRhc2hfYmFzZWxpbmVfMV92MREAdf4HZeadAQA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&edm=ANo9K5cEAAAA&_nc_zt=28&_nc_tpa=Q5bMBQImJqSQsc3tsiaW7254meIFuc_QbhJ8L3h8cZKKBzmfqN7Z6dvQ9ErXhpEAhoWSyibqYAFQw5qhIA&oh=00_AQMVQEZlVev-Ekn3iS4TSask3oq4OkfN14XaXlYjSs6TGg&oe=6AD57413",
    thumbnail_url:
      "https://scontent-del3-2.cdninstagram.com/v/t51.82787-15/848455275_17953004202272512_3687387400136184358_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=SWM2yk8QsDwQ7kNvwFJwgQB&_nc_oc=AdregWduzqQP1dAg-7arBX1U6SX0z_1DSLyn2sKhjp-RtnkoFH19zqvK4VrhLHJ0iRw&_nc_zt=23&_nc_ht=scontent-del3-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&_nc_tpa=Q5bMBQI5jHGau_ZL7VKjYRIgtLgZnNLrM97V00MUlbKMQ3f6OmYb-jFKGA9Fy4_XjgEi6wfRtiHiV6tLqA&oh=00_AQNpzPrvacsT6-Sib-dTy-k4nfiNyOwIyOFjvvZa7iCdEg&oe=6AD95960",
    timestamp: "2026-10-15T16:02:30+0000",
    username: "ankitkarnwal33",
    permalink: "https://www.instagram.com/reel/DehVjTcxb0F/",
  },
  {
    id: "17871314625647339",
    caption: "❤️😊",
    media_type: "CAROUSEL_ALBUM",
    media_url:
      "https://scontent-del2-3.cdninstagram.com/v/t51.82787-15/847998487_17952844284272512_1057541862168188486_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=SOYKb-s5JYwQ7kNvwGHSetn&_nc_oc=Adpwosv5UDHcGc02Cf1NfFXAzXjUXAb-YTAswwbIGh3cgNPmfm02tyxeRx6pGwRwCmk&_nc_zt=23&_nc_ht=scontent-del2-3.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&_nc_tpa=Q5bMBQIyMWiJL44c-7BeV5036XkC_q96eB55cWIglSaFHU3Z214ZakA3mTK5OX2NRt34ZYl0wr9eYm5AhQ&oh=00_AQMPVDFT4La655B2WCsS66EPZUbKU7Y1CPhGkX2YGRzUWA&oe=6AD97607",
    timestamp: "2026-10-14T16:15:33+0000",
    username: "ankitkarnwal33",
    permalink: "https://www.instagram.com/p/Deeyj7LmJ5C/",
  },
  {
    id: "18136456195631582",
    caption: "❤️❤️❤️\n.\n.\n.\n.",
    media_type: "CAROUSEL_ALBUM",
    media_url:
      "https://scontent-del3-1.cdninstagram.com/v/t51.82787-15/844826681_17952622617272512_672729722094870384_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=cf4O54ghG0YQ7kNvwE1o9a6&_nc_oc=AdrpGswvcWHO0IBcttI2YbZKgccXBuF8FzIGLtgeHFpHAvJhiUwS7U3AfXo0A-QNRaw&_nc_zt=23&_nc_ht=scontent-del3-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&_nc_tpa=Q5bMBQIu0YXPoF2s6LL32n-zczRze8_1zrPfrlwR_yZxlKiBq4TimhohsCEjVHjmbD02heol_Rvb6UVY6g&oh=00_AQMMyb-baM7ObNHoeaBLYUQMZOT9QMRKdLzubgtIZaMmeg&oe=6AD974F7",
    timestamp: "2026-10-13T03:10:40+0000",
    username: "ankitkarnwal33",
    permalink: "https://www.instagram.com/p/Deaz8cpGN_w/",
  },
  {
    id: "18631486735016787",
    caption:
      "Laminating my hunter 350 tokyo black ❤️❤️\n\nTokyo black, hunter 350 tokyo black, hunter 350 tokyo, Royal Enfield, royal Enfield hunter 350, tokyo, RE hunter 350, hunter 350 bike, chalrey chalre baal\n \n#hunter350 #chalreychalreywaal❤️new_trending_song #chalreychalreywaal❤️",
    media_type: "IMAGE",
    media_url:
      "https://scontent-del3-1.cdninstagram.com/v/t51.82787-15/847049120_17952396114272512_2088257406344487673_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=iaFJ5oFy3h0Q7kNvwGkGlJL&_nc_oc=AdoALSSPAejPwYvVVMaUv_iAv1SDPXIklNnrohidAcpRlbPIfTNeQK16lYfBMNcgDXE&_nc_zt=23&_nc_ht=scontent-del3-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&_nc_tpa=Q5bMBQJ7WNR_AhJhc2u_OYv91Q2RYElEGvKL6RJSE_RcOt2Uv-YLjwJyE2fQdMAQ0UpAzdlBjgvTuH3Qpw&oh=00_AQP1QB6WHcE_eBwAeRal98WvmCwK4N_5oJUZfduRfI8I-w&oe=6AD97D7B",
    timestamp: "2026-10-11T13:49:05+0000",
    username: "ankitkarnwal33",
    permalink: "https://www.instagram.com/p/DeWzCMeRm6m/",
  },
  {
    id: "18115704467097092",
    caption: "Wait for the beast 💀🕷️\n\n#walk #bullet #fyp #viral #hunter350",
    media_type: "VIDEO",
    media_url:
      "https://scontent-del3-2.cdninstagram.com/o1/v/t2/f2/m86/AQOjtT2Eb-WEFdyFYaHiGw3s1chbPx5fEtx4dNsI3rvCdS0WhbLTJrPckZnZ2TQ9gUYczIlM6Z0MJ4xx3jnlYBokjqSm3ij424QtL1s.mp4?_nc_cat=110&_nc_sid=5e9851&_nc_ht=scontent-del3-2.cdninstagram.com&_nc_ohc=QVYnUsRI_noQ7kNvwEvUOHk&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MTUxMDQ0ODI2NDI0NTc3NCwiYXNzZXRfYWdlX2RheXMiOjksInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjo5LCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&vs=cccbb024d51dab97&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC85RTZBRkU0MDA4RjQ0OTkzQTBENzFFNDdGMTRCMEM5NF92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYUWlnX3hwdl9wbGFjZW1lbnRfcGVybWFuZW50X3YyLzlBQjExQjY0NzA0ODQyOTA4RTBBMDdFOEVBRTI2REI2X2F1ZGlvX2Rhc2hpbml0Lm1wNBUCAsgBEgAoABgAGwKIB3VzZV9vaWwBMRJwcm9ncmVzc2l2ZV9yZWNpcGUBMRUAACacyO_D1O-uBRUCKAJDMywXQCNU_fO2RaIYEmRhc2hfYmFzZWxpbmVfMV92MREAdf4HZeadAQA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&edm=ANo9K5cEAAAA&_nc_zt=28&_nc_tpa=Q5bMBQIF97ZlvgEREljQmYZGXc72NHN7D4XVtnFzyimxU2uot9OhYiFkcp9eLJxs4RB0TjaPdyOZLP6qUQ&oh=00_AQOcLRbpioAHcaP4L_xzSgVD9Qbvk0bVo3GzyMxjZgEXuA&oe=6AD5798B",
    thumbnail_url:
      "https://scontent-del2-3.cdninstagram.com/v/t51.82787-15/839754085_17951951265272512_8606684316005973207_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=gWeJxRNsQ3AQ7kNvwHFx9fO&_nc_oc=AdonhuHjxgT4EQaQVPNkkQeFV0yXXOVlpdlOXIx-5UarIRddj3qgoK6hNO_Awn4C1Hk&_nc_zt=23&_nc_ht=scontent-del2-3.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&_nc_tpa=Q5bMBQI0RYDKSYIM7q8lremjQVh9J0DFNpjY20XMh7dVUhrIokus8KeMD5kePV9k2V0LKd0rESTjOQ0BnQ&oh=00_AQMB2zMMKVCsGDI5LJSf_8buJALuu45_uGfRIG7hWI6oeQ&oe=6AD9631F",
    timestamp: "2026-10-08T13:00:17+0000",
    username: "ankitkarnwal33",
    permalink: "https://www.instagram.com/reel/DeO_MlgRN7X/",
  },
  {
    id: "18129524245695516",
    caption:
      "Forever grateful ❤️ \n\n#villagevibes #village #villagelife🏡  #healing #villager",
    media_type: "VIDEO",
    thumbnail_url:
      "https://scontent-del2-3.cdninstagram.com/v/t51.82787-15/841411357_17951899890272512_2389788230929320863_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=_Mv4qTj1rikQ7kNvwHzVjXY&_nc_oc=AdpjU3ce7uDiU1qs4CLyEkgi0f55rk60zCYLrI6Yaenqr1BUnU4xusPScSSBc7gSiKc&_nc_zt=23&_nc_ht=scontent-del2-3.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&_nc_tpa=Q5bMBQKnrC-sfwCPKIIytPFJ-2C_vB0VK-pi4HBZYn6PxCthqXc7rPfLbXbB4XF8bycJoLSHs_5Y8ndqUw&oh=00_AQPkKQMBNkltwVNl3aKcFbLYGrGK9hvNC1DMprv6Z8B0XA&oe=6AD975EC",
    timestamp: "2026-10-08T03:24:30+0000",
    username: "ankitkarnwal33",
    permalink: "https://www.instagram.com/reel/DeN9Y-0xXlz/",
  },
  {
    id: "18434040373180111",
    caption: "❤️❤️❤️\n.\n.\n.\n#love #tokyoblack #hunter350 #royalenfield",
    media_type: "VIDEO",
    media_url:
      "https://scontent-del3-2.cdninstagram.com/o1/v/t2/f2/m86/AQPilBqt2CfG_uCOocZqjVUBl-aQJUyOswM9MUQ_7WyJtwNKt2ket4L56e9fledCuiHAJWYVvWQeHYsdk-hLcsnZ2ht3S955hJDmVLI.mp4?_nc_cat=108&_nc_sid=5e9851&_nc_ht=scontent-del3-2.cdninstagram.com&_nc_ohc=vnC6479sB5sQ7kNvwF4Gj0U&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6ODQ5NzAxNDIxNTM0Nzc0LCJhc3NldF9hZ2VfZGF5cyI6MTAsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjoxOSwidXJsZ2VuX3NvdXJjZSI6Ind3dyJ9&ccb=17-1&vs=7b4cad0fe9658594&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC82MUI1RkRGMzY1Q0Y0OEIwQjBENEFCRUNBMzIxMDE2Ql92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYUWlnX3hwdl9wbGFjZW1lbnRfcGVybWFuZW50X3YyLzUzNDdCQTRCOUE3RTQzODc4RjkwRkU2RTNFMDQ3Rjg3X2F1ZGlvX2Rhc2hpbml0Lm1wNBUCAsgBEgAoABgAGwKIB3VzZV9vaWwBMRJwcm9ncmVzc2l2ZV9yZWNpcGUBMRUAACbsuKr2kLOCAxUCKAJDMywXQDNVP3ztkWgYEmRhc2hfYmFzZWxpbmVfMV92MREAdf4HZeadAQA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&edm=ANo9K5cEAAAA&_nc_zt=28&_nc_tpa=Q5bMBQIJq6y5LlUm5fToKyWksSiC1JH0P-o3YPu82FGEmgB9fonxvXX2G2aYkfRFnatxK7hBuWImagYHFg&oh=00_AQPwoubVvEiqdetlEyUYuFh9j7CPunWHlCMb0G43J3vN3g&oe=6AD57241",
    thumbnail_url:
      "https://scontent-del3-1.cdninstagram.com/v/t51.82787-15/838715266_17951695563272512_5492337255960162602_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=faaPxHeRGPMQ7kNvwE0aQmC&_nc_oc=AdqBQZzffabehXQSaxafuLaj_tPtQs0IOyDA8LNILikZhVwMl_zm-XSmWNUw4JwFY34&_nc_zt=23&_nc_ht=scontent-del3-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&_nc_tpa=Q5bMBQJ6UnmJ4nJpBQtk_1Xk3qU41IwG2yjx3CKFXg9tLUIIMmknWBajytmS3cQgwF4nX8uuQO-HvxKRIQ&oh=00_AQMZACEkL6nTNEWh--sPk8cS9hCCAFCd1fu3bxUquQ5a4g&oe=6AD977BC",
    timestamp: "2026-10-06T17:12:02+0000",
    username: "ankitkarnwal33",
    permalink: "https://www.instagram.com/reel/DeKSZbWxr7U/",
  },
  {
    id: "18130656274685438",
    caption:
      "From dreaming about a Royal Enfield as a kid to finally riding one of my own… 🖤🏍️\n\nSome dreams take years to come true, but when they do, the feeling is priceless. ❤️\n\nToday, I’m proud to call this Royal Enfield Hunter 350 – Tokyo Black mine. 🖤🔥\n\nIt’s not just a bike. It’s a childhood dream, a symbol of hard work, and a reminder that dreams really do come true when you keep moving forward. ✨\n\nDreamed it. Worked for it. Earned it. ❤️\n\n#RoyalEnfield #Hunter350 #Hunter350TokyoBlack #RoyalEnfieldHunter350 #TokyoBlack REHunter350 RoyalEnfieldIndia NewBike BikeDelivery BikeLife MotorcycleLife RiderLife BikerLife ChildhoodDream DreamComeTrue DreamBike NewBeginnings RideOn RoyalEnfieldLovers IndianBikers MotorcyclePhotography",
    media_type: "CAROUSEL_ALBUM",
    media_url:
      "https://scontent-del3-1.cdninstagram.com/v/t51.82787-15/834644661_17951562564272512_8268508171526175249_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=KcS1gZxfzzYQ7kNvwEjpnx3&_nc_oc=AdrwHn7FHXTuQM47rN8v7zbI-DaiYnyETFgU6Lo9-2WW4HW-8YX0vn8Z1DM4s3uGQ0w&_nc_zt=23&_nc_ht=scontent-del3-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=G4nrqrIb1P4gQmAGRX9f1A&_nc_tpa=Q5bMBQLkCckZPjqixtjPMC9cbwJEVV4aMdR5u-R6Cl216rIomUz1L32Y8McYAVkGL0_naT9DDj0nTNW6hA&oh=00_AQN0cfKeNOenjwBvvktKCCmjf_h-aNjVTr4w0jOTTTTXjA&oe=6AD98372",
    timestamp: "2026-10-05T18:07:55+0000",
    username: "ankitkarnwal33",
    permalink: "https://www.instagram.com/p/DeH0REMj6SX/",
  },
];

function normalizeMediaPage(page: unknown): InstagramMedia[] {
  if (Array.isArray(page)) return page as InstagramMedia[];
  if (
    page &&
    typeof page === "object" &&
    "data" in page &&
    Array.isArray((page as { data: unknown }).data)
  ) {
    return (page as { data: InstagramMedia[] }).data;
  }
  return [];
}

export default function UploadedMedia({
  canCreateAutomation = true,
}: {
  canCreateAutomation?: boolean;
}) {
  const trpcClient = useTRPCClient();

  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["instagram", "getMediaWithPagination"],
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as string | undefined;
      return trpcClient.instagram.getMediaWithPagination.query({
        cursor,
        page: 1,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (Array.isArray(lastPage)) return undefined;
      if (!lastPage.hasNextPage) return undefined;
      const c = lastPage.cursor;
      if (typeof c !== "string" || c.length === 0) return undefined;
      return c;
    },
    placeholderData: (prev) => prev,
  });

  let mediaList = data?.pages.flatMap((page) => normalizeMediaPage(page)) ?? [];

  if (process.env.NODE_ENV === "development") {
    mediaList = ReelsData;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3   gap-4">
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="w-full rounded-lg">
                <CardContent>
                  <Skeleton className="aspect-video w-full relative opacity-30">
                    <IoMdImage className="w-10 h-10 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </Skeleton>
                </CardContent>
                <CardHeader>
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 mt-5" />
                </CardHeader>
              </Card>
            ))
          : mediaList.map((media: InstagramMedia) => (
              <MediaCard
                key={media.id}
                media={media}
                canCreateAutomation={canCreateAutomation}
              />
            ))}
        {isFetching &&
          [1, 2, 3].map((item) => <Skeleton key={item} className=" h-80" />)}
      </div>
      <Separator />
      {hasNextPage && !isLoading ? (
        <div className="flex justify-center pb-10">
          <Button
            type="button"
            className="col-span-full w-fit mx-auto text-sm hover:scale-105 transition-all duration-300"
            onClick={() => void fetchNextPage()}
          >
            Load more
            {isFetchingNextPage && (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
