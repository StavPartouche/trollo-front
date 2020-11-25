<template>
<div class="nav-tools flex center">
    <!-- <h1>navTools</h1> -->
      <button>{{board.name}}</button>
      <ul>
        <li v-for="user in members" :key="user._id">{{user}}</li>
      </ul>
      <button>{{board.activityLog}}</button>
            <ul>
        <li v-for="activity in activityLog" :key="activity.createdAt">
          {{activity.txt}}
        </li>
      </ul>
</div>
</template>

<script>

export default {
    name: 'nav-tools',
    props:{
        board: Object
    },
	data() {
 return {
//        "board": 
//     {
//       "_id": "flwdjnlskjdn",
//       "name": "update test",
//       "members": [],
//       "labels": [],
//       "background": {
//         "color": "",
//         "url": ""
//       },
//       "creator": "kaki",
//       "dueDate": "",
//       "description": "",
//       "activityLog": [
//         {
//           "createdAt": "",
//           "txt": "",
//           "userId": "",
//           "taskId": ""
//         }
//       ],
//       "lists": [
//         {
//           "id": "",
//           "name": "",
//           "tasks": [
//             {
//               "id": "",
//               "name": "",
//               "description": "",
//               "dueDate": "",
//               "createdAt": "",
//               "backgroundColor": "",
//               "members": [],
//               "labels": [
//                 {
//                   "idx": ""
//                 }
//               ],
//               "comments": [
//                 {
//                   "createdBy": "",
//                   "txt": "",
//                   "createdAt": ""
//                 }
//               ],
//               "activityLog": [
//                 {
//                   "byUser": "",
//                   "activity": "",
//                   "createdAt": ""
//                 }
//               ],
//               "previewImg": "",
//               "attachments": [],
//               "checkLists": []
//             }
//           ]
//         }
//       ]
//     },
 }
    },
    methods:{

    },
}
</script>