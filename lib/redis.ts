import Redis from "ioredis"

const redis = new Redis("rediss://default:AZfgAAIjcDFlZTdjZDc0ODRkMjE0YjdjYmVjOTMzOGRhNzIwZjhjOHAxMA@improved-scorpion-38880.upstash.io:6379");

export default redis