// import { mailService } from '../services/mail-service.js'
// import { storageService } from '../services/async-storage.service.js '
import { router } from '../../../routes.js'
import { eventBus } from '../services/event-bus.service.js'
import mailCompose from './mail-compose.cmp.js'


export default {
    props: ["mails"],
    template: `
    <aside :key="componentKey">
            <div class="compose">
                <router-link to="/mail/edit">
                <button @click="" class="compose-btn">
                    <img class="compose-img btn" src="../../assets/img/compose.jpeg"/>
                    <span>Compose</span>
                </button>
                </router-link>
            </div>

            <section class="actions flex">

            <router-link to="/mail">
                <button class="actions-btn-nav">
                    <img src="../../assets/img/inbox_white_20dp.png"/>
                    <span class="txt-nav">Inbox</span>    
                    <span> {{ calculateInfo('isReceived') }} </span>
                </button>
            </router-link>
                
                <router-link to="/mail/starred">
                <button class="actions-btn-nav">
                    <img src="../../assets/img/star.jpeg"/>
                    <span class="txt-nav">Starred</span>    
                    <span>{{ calculateInfo('isStarred') }}</span>
                </button>
                </router-link>
                
                <router-link to="/mail/snooze">
                <button class="actions-btn-nav">
                    <img src="../../assets/img/schedule_white_20dp.png"/>
                    <span class="txt-nav">Snoozed</span>    
                    <span>{{ calculateInfo('isSnoozed') }}</span>
                </button> 
            </router-link>
                
                <router-link to="/mail/sent">
                <button class="actions-btn-nav">
                    <img src="../../assets/img/send_white_20dp.png"/>
                    <span class="txt-nav">Sent</span>    
                    <span>{{ calculateInfo('isSent') }}</span>
                </button>
            </router-link>

                <router-link to="/mail/schedule">
                <button class="actions-btn-nav">
                    <img src="../../assets/img/schedule_send_white_20dp.png"/>
                    <span class="txt-nav">Scheduled</span>    
                    <span>{{ calculateInfo('isSchedule') }}</span>
                </button> 
            </router-link>

                <router-link to="/mail/draft">
                <button class="actions-btn-nav">
                    <img src="../../assets/img/inbox_white_20dp.png"/>
                    <span class="txt-nav">Drafts</span>    
                    <span>{{ calculateInfo('isDraft') }}</span>
                </button> 
            </router-link>

            </section >

        </aside>
        <mail-compose :compose="compose"/>
    `,
    data: {
        componentKey: 0
    },
    created() {
        // eventBus.on('scheduleMsg', this.schedule)
    },
    methods: {
        forceRerender() {
            this.componentKey += 1
        }
        ,
        schedule(time) {
            setTimeout(() => {
                // console.log('wowoowo')
                // this.load()
                // this.forceRerender()
                // this.$forceUpdate()
                // vm.$forceUpdate()
                // this.$router.push
                this.$router.push('/mail/sent')

            }, time)
        }
        ,
        showCompose() {
            this.compose = !this.compose
        },
        calculateInfo(key) {
            // console.log(this.mails)
            // console.log(key);
            var counter = 0
            if (this.mails) {
                this.mails.forEach(mail => {
                    if (mail[key]) counter++
                })
                // console.log(counter, 'counter');
                return counter
            }


        }
    },

    // mounted() {
    //     this.calculateInfo('isStarred')
    // }
    // ,
    data() {
        return {
            compose: false

        }
    },
    components: {
        mailCompose
    }
}