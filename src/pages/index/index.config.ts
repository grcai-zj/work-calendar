export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '工作日历' })
  : { navigationBarTitleText: '工作日历' }
