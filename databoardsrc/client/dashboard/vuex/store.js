import Vue from 'vue'
import Vuex from 'vuex'
import {
  Indicator
} from 'mint-ui';
Vue.use(Vuex);

const state = {
  token: "",
  isLoading: false,
  direction: 'forward',
  curalllisttab: '未完成',
  selectdept: '请选择科室',
  selectdeptcode: '',
  selectReassigndeptcode: '',
  selectReassigndeptName: '',
  ticket: {
    id: "",
    type: "投诉",
    phone: "",
    reporter: "",
    content: "",
    status: "new",
    assignedType: 1,
    assignedTo: "",
    assignedName: "",
  },
  fileUploads: [],
  headertab: {
    showheadertab: false,
    curheadertab: "",
    tabs: {}
  },
  statusfilterlist: {
    '未完成': [{
      type: 'new',
      name: '待处理',
      selected: false
    },{
      type: 'cooperated',
      name: '科室协作',
      selected: false
    },{
      type: 'active',
      name: '处理中',
      selected: false
    }, {
      type: 'pending',
      name: '待评价',
      selected: false
    }],
    '已完成': [{
      type: 'completed',
      name: '已完成',
      selected: false
    }, {
      type: 'cancel',
      name: '已退单',
      selected: false
    },
     {
      type: 'deleted',
      name: '已删除',
      selected: false
    }],
    '我创建的': [{
      type: 'new',
      name: '待处理',
      selected: false
    }, {
      type: 'active',
      name: '处理中',
      selected: false
    }, {
      type: 'cooperated',
      name: '科室协作',
      selected: false
    },{
      type: 'pending',
      name: '待评价',
      selected: false
    }, {
      type: 'completed',
      name: '已完成',
      selected: false
    },{
      type: 'cancel',
      name: '已退单',
      selected: false
    },
     {
      type: 'deleted',
      name: '已删除',
      selected: false
    }],
    '我的抢单': [{
      type: 'new',
      name: '待处理',
      selected: false
    }, {
      type: 'active',
      name: '处理中',
      selected: false
    }, {
      type: 'cooperated',
      name: '科室协作',
      selected: false
    },{
      type: 'pending',
      name: '待评价',
      selected: false
    }, {
      type: 'completed',
      name: '已完成',
      selected: false
    },{
      type: 'cancel',
      name: '已退单',
      selected: false
    },
     {
      type: 'deleted',
      name: '已删除',
      selected: false
    }]
  },
  userinfo: {}
}
export default new Vuex.Store({
  state,
  mutations: {
    UPDATE_LOADING(state, status) {
      state.isLoading = status
      if (state.isLoading) {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        });
      } else {
        Indicator.close();
      }
    },
    UPDATE_DIRECTION(state, direction) {
      state.direction = direction
    },
    SELECT_DEPT(state, payload) {
      state.selectdept = payload.name;
      state.selectdeptcode = payload.code;
    },
    SELECT_ASSIGNDEPT(state, payload) {
      state.selectReassigndeptcode = payload.code;
      state.selectReassigndeptName = payload.name;
    },
    UPDATE_NEWTICKET(state, payload) {
      if (payload.type != undefined) {
        state.ticket.type = payload.type
      }
      if (payload.phone != undefined) {
        state.ticket.phone = payload.phone
      }
      if (payload.reporter != undefined) {
        state.ticket.reporter = payload.reporter
      }
      if (payload.content != undefined) {
        state.ticket.content = payload.content
      }
      if (payload.files != undefined) {
        state.fileUploads = payload.files
      }
    },
    CLEAR_NEWTICKET(state) {
      state.ticket.type = "投诉"
      state.ticket.phone = ""
      state.ticket.reporter = ""
      state.ticket.content = ""
    },
    INIT_HEADERTAB(state, payload) {
      state.headertab.showheadertab = true;
      state.headertab.tabs = payload;
      state.headertab.curheadertab = payload[0].name;
    },
    CLOSE_HEADERTAB(state) {
      state.headertab.showheadertab = false;
    },
    UPDATE_HEADERTAB(state, name) {
      state.headertab.curheadertab = name;
    },
    UPDATE_USEINFO(state, payload) {
      state.userinfo = payload;
    },
    UPDATE_TOKEN(state, payload) {
      state.token = payload;
    },
    UPDATE_STATE(state, payload) {
      state.curalllisttab = payload.curalllisttab;
    },
    UPDATE_STATUSFILTER(state, name) {
      var list = state.statusfilterlist[state.curalllisttab];
      for (var i = 0; i < list.length; i++) {
        if (list[i].name == name) {
          list[i].selected = !list[i].selected
        }
      }
    }

  }
})