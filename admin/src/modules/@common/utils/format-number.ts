export default (value: number, options: any = undefined) => new Intl.NumberFormat('en-GB', options).format(value);
