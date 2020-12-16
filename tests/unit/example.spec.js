import { shallowMount } from '@vue/test-utils'
import homePage from '@/views/home-page.vue'

describe('home-page.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(homePage, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
