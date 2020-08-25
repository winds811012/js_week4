var app = new Vue({
  el: "#app",
  data: {
    user: {
      token: "",
      uuid: "9b70b4ea-a223-42d1-99e3-ba225ff8bc2d",
    },
    pagination: {},
    productList: [
      // {
      //   type: "風景",
      //   title: "風景攝影課程",
      //   price: 7000,
      //   salePrice: 3500,
      //   isActive: false,
      //   img:
      //     "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
      //   unit: "",
      //   description: "",
      //   content: "",
      //   id: 111,
      // },
      // {
      //   type: "人像",
      //   title: "人像攝影課程",
      //   price: 7999,
      //   salePrice: 4500,
      //   isActive: true,
      //   img:
      //     "https://images.unsplash.com/flagged/photo-1557823334-1cb96d97a297?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
      //   unit: "",
      //   description: "",
      //   content: "",
      //   id: 222,
      // },
    ],
    modal: {
      type: null,
      title: "",
      bgColor: "",
      item: {
        category: null,
        title: null,
        origin_price: null,
        price: null,
        enabled: false,
        imageUrl: [],
        unit: null,
        description: null,
        content: null,
      },
    },
  },
  created() {
    this.user.token = document.cookie.replace(
      /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    //若沒token則返回登入頁
    if (this.user.token === "") {
      window.location = "Login.html";
    }
    this.getProducts();
  },
  methods: {
    //打開modal時判斷
    openModal(modalType, id) {
      var vm = this;
      switch (modalType) {
        case "new":
          vm.modal.title = "新增產品";
          vm.modal.bgColor = "bg-dark";
          vm.modal.item = {
            category: null,
            title: null,
            origin_price: null,
            price: null,
            enabled: false,
            imageUrl: [],
            unit: null,
            description: null,
            content: null,
          };
          break;
        case "edit":
          vm.modal.title = "編輯產品";
          vm.modal.bgColor = "bg-dark";
          vm.productList.forEach((element) => {
            if (element.id === id) {
              vm.modal.item = element;
            }
          });
          break;
        case "delete":
          vm.modal.title = "刪除產品";
          vm.modal.bgColor = "bg-danger";
          vm.modal.item.id = id;
          vm.productList.forEach((element) => {
            if (element.id === id) {
              vm.modal.item = element;
            }
          });
          break;
      }
      vm.modal.type = modalType;
      $("#Modal").modal("show");
    },
    //檢查是甚麼狀態的確認鍵
    checkBtnType(type) {
      if (type === "new") {
        this.updateProduct(type, null);
      } else if (type === "edit") {
        this.updateProduct(type, this.modal.item.id);
      }
    },
    //取得資料
    getProducts(page = 1) {
      let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/products?page=${page}`;
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      axios.get(api).then((res) => {
        this.productList = res.data.data;
        this.pagination = res.data.meta.pagination;
      });
    },

    //更新資料
    updateProduct(type, id) {
      let vm = this;
      let api = "";
      let httpMethod = "post";
      if (type === "new") {
        api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
      } else if (type === "edit") {
        console.log("id", id);
        api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${id}`;
        httpMethod = "patch";
      }
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      axios[httpMethod](api, this.modal.item)
        .then(() => {
          this.getProducts();
        })
        .catch((error) => {
          console.log(error); // 若出現錯誤則顯示錯誤訊息
        });
      $("#Modal").modal("hide");
      // this.modal.item = {};
    },
    //刪除資料
    deleteProduct() {
      const vm = this;
      let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${vm.modal.item.id}`;
      // vm.productList.forEach((element, index) => {
      //   if (element.id === vm.modal.item.id) {
      //     vm.productList.splice(index, 1);
      //   }
      // });
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      axios.delete(api).then(() => {
        $("#delProductModal").modal("hide"); // 刪除成功後關閉 Modal
        this.getProducts(); // 重新取得全部資料
      });
      // $("#Modal").modal("hide");
      // this.modal.item = {};
    },
  },
});
