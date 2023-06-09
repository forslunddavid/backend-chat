# **Datamodellering**

| Object      | Properties | Datatype    | Beskrivning                                             |
| :---------- | :--------- | :---------- | :------------------------------------------------------ |
| **User**    | userId     | number      |                                                         |
|             | Username   | string      |                                                         |
|             | Password   | string      |                                                         |
|             | channels   | array       | Array med id för kanalerna användaren har tillgång till |
| **Channel** | channelId  | number      |                                                         |
|             | name       | string      |                                                         |
|             | locked     | boolean     |                                                         |
|             | Messages   | [{message}] | Array med message object i                              |
| **Message** | messageId  | number      |                                                         |
|             | channelId  | number      | id till kanalen meddelandet hör                         |
|             | userId     | number      | id till avsändaren                                      |
|             | content    | string      |                                                         |
|             | timestamp  | number      |                                                         |

# **API Endpoints**

| **Name**     | **Method** | **Endpoints**              | **Beskrivning**                        |
| :----------- | :--------- | :------------------------- | :------------------------------------- |
| **Users**    | GET        | /api/users                 | Hämta alla users                       |
|              | GET        | /api/users/:id             | Hämta specifik user med id             |
|              | POST       | /api/users                 | Skapa ny user                          |
|              | PUT        | /api/users/:id             | Ändra user                             |
|              | DELETE     | /api/users/:id             | Ta bort user                           |
| **Channels** | GET        | /api/channels              | Hämta alla channels                    |
|              | GET        | /api/channels/:id          | Hämta specifik channel med id          |
|              | POST       | /api/channels              | Skapa ny channel                       |
|              | PUT        | /api/channels/:id          | Ändra en channel                       |
|              | DELETE     | /api/channels/:id          | Ta bort en channel                     |
| **Messages** | GET        | /api//messages             | Hämta alla messages i en channel       |
|              | GET        | /api//messages/:id         | Hämta ett specifikt message med id     |
|              | POST       | /api/messages              | Skicka nytt meddelande till en channel |
|              | PUT        | /api/messages/:id          | Ändra ett meddelande                   |
|              | DELETE     | /api/messages/:id          | Ta bort ett meddelande                 |
|              | GET        | /api/messages/channels/:id | Hämta meddelanden från en kanal        |
| **Login**    | POST       | /api/login                 | Skicka login request                   |
