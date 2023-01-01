import { storageService } from '../services/async-storage.service.js'
import { mailService } from '../services/mail-service.js'
import { eventBus } from '../services/event-bus.service.js'

import mailFilter from '../cmps/mail-filter.cmp.js'
import mailList from '../cmps/mail-list.cmp.js'

import navBar from '../cmps/nav-bar.cmp.js'

import mailPrev from '../cmps/mail-prev.cmp.js'
import leftHeader from '../cmps/left-header.cmp.js'
import rightHeader from '../cmps/right-header.cmp.js'
// import mailEdit from './mail-edit.cmp.js'

export default {
    props: ["filterByObj"],
    template: `
    <section class="grid-app-mail">

        <header class="">
           <left-header/>
            <div class="right-header">
                <mail-filter v-if="mails" @filter="filter"/>
               <right-header/>
            </div>    
          </header>

          <nav-bar :mails="mails"/>
                
              

        <main>
            <!-- Main -->
            <div class="head-actions flex space-between">

                <div class="flex main-action-left">
                   <!-- <button class="nonebcc">  -->
                    <div class="flex select">
                        <img @click="removeSelected" class="main-action cursor-pointer select btn-active" :class="deleteMainStyle"  src="../../assets/img/delete_white_20dp.png"/>
                        <img  @click="print" class="main-action cursor-pointer" src="../../assets/img/actions-main-cmp/arrow_drop_down_white_20dp.png"/>
                    </div>
                    <div class="flex ref-more-act">
                        <img class="main-action cursor-pointer"  src="../../assets/img/actions-main-cmp/refresh.png"/>
                        <img  class="main-action cursor-pointer" src="../../assets/img/actions-main-cmp/more_vert.png"/>
                    </div>
                </div>
                


                <div class="flex main-action-right">
                    <!-- <span class="mail-to-display">1-14 of 14</span> -->
                    <span class="mail-to-display" v-if="sumMails">1-{{ sumMails }} of {{ sumMails }}</span>
                    <span class="mail-to-display" v-else="sumMails">0 of 0</span>

                    <!-- this.sumMails -->
                    <img  class="main-action cursor-pointer" src="../../assets/img/actions-main-cmp/chevron_left.png"/>
                    <img  class="main-action cursor-pointer" src="../../assets/img/actions-main-cmp/chevron_right_white_20dp.png"/>
                </div>

            </div>
            <!-- <router-link to="/mail/sent">
                <button>
                    <img src="../../assets/img/send_white_20dp.png"/>
                    <span>Sent</span>    
                    <span>{{ calculateInfo('isSent') }}</span>
                </router-link>
                </button> -->
                
                <section class="grid main-sorting" >
                    
                    <router-link to="/mail">
                        <div class="cursor-pointer">
                            <img src="../../assets/img/actions-main-cmp/Primary.png" />
                            <span class="main-sorting-txt">Primary</span>
                        </div>
                    </router-link>
                
            <router-link to="/mail/promotion">
                <div class="cursor-pointer">
                    <img src="../../assets/img/actions-main-cmp/promotion.png" />
                    <span class="main-sorting-txt">Promotions</span>
                </div>
            </router-link>

            <router-link to="/mail/social">
                <div class="cursor-pointer">
                    <img src="../../assets/img/actions-main-cmp/social.png" />
                    <span class="main-sorting-txt">Social</span>
                </div>
            </router-link>

            <router-link to="/mail/update">
                <div class="cursor-pointer">
                   <img src="../../assets/img/actions-main-cmp/update.png" />
                    <span class="main-sorting-txt">Updates</span>
                </div>
            </router-link>

            </section>

            <mail-prev/>
            <section class="mail-app" v-if="mails">
        <mail-list
            @changeUrlImgeIndicate="changeUrlImgeIndicate"
            @selected="selectMail" 
            @remove="removeMail" 
            @snooze="snooze"
            :mails="mailsToShow"/>
         </section>


    
            <!-- TODO: DIV , DIV -->
            <!-- <div class="sort-subject">sort-subject</div> -->
            <!-- <div class="mails-list">mails-list</div> -->

        </main>
    </section>


 
    `,
    data() {
        return {
            mails: null,
            filterBy: {},
            mark: false,
            timeOfSnoozed: null,
            sumMails: null,
        }
    },
    created() {
        this.load()
        eventBus.on('scheduleMsg', this.scheduleMsg)
        // console.log(new Date());
    },
    methods: {

        snooze(mailId) {
            // console.log(mailId)
            this.timeOfSnoozed = +prompt('enter time of snooze (seconds)') * 1000
            storageService.get('mails', mailId)
                .then((mail) => {
                    mail.isSnoozed = true
                    return mail
                })
                // TODO: refactor to this function...not duplicate of code....
                .then((mail) => {
                    mailService.save(mail)
                    setTimeout(() => {
                        this.$router.push('/mail/snooze')
                    }, 10)
                    setTimeout(() => {
                        this.$router.push('/mail')
                    }, 10)
                    return mail
                })

                .then((mail) => {
                    setTimeout(() => {
                        storageService.get('mails', mailId)
                            .then((mail) => {
                                mail.isSnoozed = false
                                return mail
                            })
                            .then((mail) => {
                                mailService.save(mail)
                                setTimeout(() => {
                                    this.$router.push('/mail/snooze')
                                }, 10)
                                setTimeout(() => {
                                    this.$router.push('/mail')
                                }, 10)
                                return mail
                            })
                    }, this.timeOfSnoozed);
                })
        },
        scheduleMsg(time) {
            setTimeout(() => {
                // console.log('wowoowo')
                this.load()
                // .then
            }, time);
        },

        load() {
            mailService.query()
                .then((mails) => {
                    this.mails = mails
                    return mails
                })
        },
        print() {
            console.log('print')
        },
        removeMail(mailId) {
            mailService.remove(mailId)
                .then(() => {
                    const idx = this.mails.findIndex(mail => mail.id === mailId)
                    this.mails.splice(idx, 1)

                    const msg = {
                        txt: `Mail ${mailId} deleted...`,
                        type: 'success',
                    }
                    eventBus.emit('user-msg', msg)
                })
        },
        selectMail(mail) {
            this.selectedMail = mail
        },
        mailSaved(mail) {
            this.mails.push(mail)
        },
        filter(filterBy) {
            console.log(filterBy)
            this.filterBy = filterBy
        },
        changeUrlImgeIndicate() {
            this.load()
        },
        removeSelected() {
            mailService.query()
                .then(mails => {
                    var m = mails.filter(mail => !mail.isSelected)
                    return m
                })
                .then((m) => {
                    localStorage.setItem('mails', JSON.stringify(m))
                    // console.log(m)
                    this.load()
                    // this.mark = !this.mark
                    return Promise.resolve()

                })
        }
    },
    computed: {



        mailsToShow() {
            const regex = new RegExp(this.filterBy.title, 'i')
            // mails = this.mails.filter(mail => regex.test(mail.title))

            var mails = this.mails.filter(mail => {
                (mail.isReceived)
            })

            if (this.filterByObj) {

                if (this.filterByObj.byStar) {
                    mails = this.mails.filter(mail => (mail.isStarred))
                }

                if (this.filterByObj.bySent) {
                    mails = this.mails.filter(mail => (mail.isSent))
                }

                if (this.filterByObj.byDraft) {
                    mails = this.mails.filter(mail => (mail.isDraft))
                }
                if (this.filterByObj.bySchedule) {
                    mails = this.mails.filter(mail => (mail.isSchedule))
                }
                if (this.filterByObj.bySnooze) {
                    mails = this.mails.filter(mail => (mail.isSnoozed))
                }
                if (this.filterByObj.byPromotion) {
                    mails = this.mails.filter(mail => (mail.isPromotion))
                }
                if (this.filterByObj.bySocial) {
                    mails = this.mails.filter(mail => (mail.isSocial))
                }
                if (this.filterByObj.byUpdate) {
                    mails = this.mails.filter(mail => (mail.isUpdate))
                }
            }
            else {
                mails = this.mails.filter(mail => regex.test(mail.title) && (mail.isReceived) && (!mail.isPromotion) && (!mail.isSocial) && (!mail.isUpdate))
            }

            this.sumMails = mails.length
            // console.log(this.sumMails, '*** this.sumMails ***');
            return mails
        },
        deleteMainStyle() {
            return { mark: this.mark }

        },
        mailId() {
            // const id = this.$route.params.id
            return this.$route.fullPath
        }


    },
    watch: {
        mailId() {
            // console.log('changed')
            this.load()

        }
    }
    ,
    components: {
        mailFilter,
        mailList,
        mailPrev,
        leftHeader,
        navBar,
        rightHeader
    }
}
