const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, onValue, get, child, remove } = require("firebase/database")

const FirebaseConfig = require("./Keys/Firebase.json")

class FirebaseApp {
    constructor(path) {
      this.path = `/${path}`
    
      // Initialize Firebase
      const app = initializeApp(FirebaseConfig);
      this.db = getDatabase(app)

    }

    onUpdate(target, callback) {
      var pathTarget = ref(this.db, `${this.path}/${target}`)
      onValue(pathTarget, (snapshot) => {
        return callback(snapshot);
      })
    }

    setValue(target, value) {
      var targetPath = ref(this.db, `${this.path}/${target}`)
      set(targetPath, value)
    }

    getValue(target) {
      var tempDB = ref(getDatabase())
      return get(child(tempDB, `${this.path}/${target}`))
    }

    delete(target) {
      remove(ref(this.db, `${this.path}/${target}`))
    }

}

module.exports = {
  FirebaseApp
}