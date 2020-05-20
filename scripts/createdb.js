import initMongo from '../src/utils/mongodb'
import Admin from '../src/models/admin'
import Albums from '../src/models/album'
import Blogs from '../src/models/blog'
import { GroupGuest, GuestSchema } from '../src/models/invitados'
import Provider from '../src/models/provedores'
import Tasks from '../src/models/task'
import User from '../src/models/user'
import Wedding from '../src/models/wedding'


async function init() {
  try {
    await initMongo()

    await Admin.remove();
    await Albums.remove();
    await Blogs.remove();
    await Finanzas.remove();
    await GroupGuest.remove();
    await GuestSchema.remove();
    await Provider.remove();
    await Tasks.remove();
    await User.remove();
    await Wedding.remove();


  } catch (err) {
    console.error(err)
  }
}

init()